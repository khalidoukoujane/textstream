package decoder

import (
	"io"
	"os/exec"
)

func StartDecoder(filepath string, frames chan<- []byte) error {
	//ffmpeg -i video.mp4 -f rawvideo -pix_fmt rgb24 -vf scale=160:90 pipe:1
	w := 160
	h := 90
	cmd := exec.Command("ffmpeg", "-i", filepath, "-f", "rawvideo", "-pix_fmt", "rgb24", "-vf", "scale=160:90", "pipe:1")
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return  err
	}
	err = cmd.Start()
	if err != nil {
		return err
	}
	defer close(frames)
	frame := make([]byte, w * h * 3)
	for {
		_, err := io.ReadFull(stdout, frame)
		if err != nil {
			break
		}
		frameCpy := make([]byte, len(frame))
		copy(frameCpy, frame)
		frames <- frameCpy
	}
	cmd.Wait()
	return err
}