package encoder

func EncodeFrame(raw []byte, width, height int) []byte {
	if len(raw) == 0 {
		return nil
	}
	chars := []byte("@#S%?*+;:,. ")
	elems := make([]byte, width*height*4)
	for i := 0; i < len(raw); i+=3 {
		r := raw[i]
		g := raw[i + 1]
		b := raw[i + 2]
		brightness := (int(r) + int(g) + int(b)) / 3
		charIndex := brightness * (len(chars)-1) / 255
		char := chars[charIndex]
		outIndex := (i / 3) * 4
		elems[outIndex] = r
		elems[outIndex + 1] = g
		elems[outIndex + 2] = b
		elems[outIndex + 3] = char
	}
	return  elems;
}