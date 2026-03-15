import speech_recognition as sr
import tempfile
import os
from pydub import AudioSegment
from .gemini_client import GeminiClient


class SpeakingAnalyzer:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.gemini = GeminiClient()

    def transcribe_audio(self, audio_file):
        """Convert uploaded audio file to text using Google Speech Recognition (free)."""
        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
            for chunk in audio_file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name

        wav_path = tmp_path + '_converted.wav'
        try:
            audio = AudioSegment.from_file(tmp_path)
            audio.export(wav_path, format='wav')

            with sr.AudioFile(wav_path) as source:
                audio_data = self.recognizer.record(source)
                transcript = self.recognizer.recognize_google(audio_data)
            return transcript
        except sr.UnknownValueError:
            return "[Could not understand audio - please speak more clearly]"
        except sr.RequestError as e:
            return f"[Speech recognition error: {e}]"
        except Exception as e:
            return f"[Audio processing error: {e}]"
        finally:
            for path in [tmp_path, wav_path]:
                if os.path.exists(path):
                    try:
                        os.unlink(path)
                    except OSError:
                        pass

    def analyze(self, audio_file, topic=None, question_text=None):
        """Full pipeline: transcribe audio then send to Gemini for assessment."""
        transcript = self.transcribe_audio(audio_file)

        # Use question_text if provided, otherwise fall back to topic title
        topic_question = question_text or (topic.title if topic else None)
        assessment = self.gemini.assess_speaking(transcript, topic_question)

        return {
            'transcript': transcript,
            'score': assessment.get('score', 0),
            'fluency': assessment.get('fluency', 0),
            'pronunciation': assessment.get('pronunciation', 0),
            'grammar': assessment.get('grammar', 0),
            'lexical_resource': assessment.get('lexical_resource', 0),
            'feedback': assessment.get('feedback', ''),
            'fluency_feedback': assessment.get('fluency_feedback', ''),
            'pronunciation_feedback': assessment.get('pronunciation_feedback', ''),
            'grammar_feedback': assessment.get('grammar_feedback', ''),
            'lexical_feedback': assessment.get('lexical_feedback', ''),
        }
