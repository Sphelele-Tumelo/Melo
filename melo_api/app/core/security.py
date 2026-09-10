import base64
import hashlib
import hmac
import secrets


def hash_password(password: str) -> str:
	salt = secrets.token_bytes(16)
	password_hash = hashlib.pbkdf2_hmac(
		"sha256", password.encode(), salt, 600_000
	)
	return f"pbkdf2_sha256$600000${base64.urlsafe_b64encode(salt).decode()}${base64.urlsafe_b64encode(password_hash).decode()}"


def verify_password(password: str, stored_hash: str) -> bool:
	try:
		algorithm, iterations, encoded_salt, encoded_hash = stored_hash.split("$", 3)
		if algorithm != "pbkdf2_sha256":
			return False
		salt = base64.urlsafe_b64decode(encoded_salt.encode())
		expected_hash = base64.urlsafe_b64decode(encoded_hash.encode())
		actual_hash = hashlib.pbkdf2_hmac(
			"sha256", password.encode(), salt, int(iterations)
		)
	except (TypeError, ValueError):
		return False

	return hmac.compare_digest(actual_hash, expected_hash)
