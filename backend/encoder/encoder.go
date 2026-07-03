package encoder

import "sync"

func EncodeFrame(raw []byte, result []byte,  width, height int)  {
    numWorkers := 4
	chars := []byte("@#S%?*+;:,. ")
    rowsPerWorker := height / numWorkers
    var wg sync.WaitGroup
    for w := 0; w < numWorkers; w++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            startRow := workerID * rowsPerWorker
            endRow := startRow + rowsPerWorker
            if workerID == numWorkers-1 {
                endRow = height
            }
            for row := startRow; row < endRow; row++ {
                for col := 0; col < width; col++ {
                    inIdx := (row*width + col) * 3
                    outIdx := (row*width + col) * 4
                    r := raw[inIdx]
                    g := raw[inIdx+1]
                    b := raw[inIdx+2]
                    brightness := (int(r) + int(g) + int(b)) / 3
                    charIdx := brightness * (len(chars)-1) / 255  
                    result[outIdx] = r
                    result[outIdx+1] = g
                    result[outIdx+2] = b
                    result[outIdx+3] = chars[charIdx]
                }
            }
        }(w)
    }
    wg.Wait()
}
