export function verifyEmail(email) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return true
	}
	return false
};

export function verifyPassword(password) {
	return password.length >= 8 ? true : false 
};

export function wait(ms) {
	var start = Date.now(),
		now = start;
	while (now - start < ms) {
		now = Date.now();
	}
}