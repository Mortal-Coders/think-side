package service

import (
	"strings"
)

type Encoder interface {
	Encode(number int64) (string, error)
}

type encodingService struct{}

func NewEncodingService() Encoder {
	return &encodingService{}
}

const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

func (e *encodingService) Encode(number int64) (string, error) {

	if number == 0 {
		return string(base62Chars[0]), nil
	}

	var encoded strings.Builder
	length := int64(len(base62Chars))

	for number > 0 {
		remainder := number % length
		encoded.WriteByte(base62Chars[remainder])
		number = number / length
	}

	return reverseString(encoded.String()), nil
}

func reverseString(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}
