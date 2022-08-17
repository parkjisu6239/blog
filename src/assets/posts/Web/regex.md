# 자주 쓰는 Regex pattern

> 전체 문법은 [여기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions) 참고

## 요약
[출처](https://digitalfortress.tech/tips/top-15-commonly-used-regex/)

### Character classes
|expression|description|
|---|---|
|.|any character except newline|
|\w, \d, \s| word, digit, space|
|\W, \D, \S| not word, digit, space|
|[abc]|any of a, b or c|
[^abc]|not a, b or c|
|[a-z]|between a, z|


### Quantifiers & Alternation

|expression|description|
|---|---|
|a*|0개 이상의 a|
|a+|1개 이상의 a|
|a?| 0개또는 1개의 a|
|a{2}| 2개의 연속된 a|
|a{2,}| 2개의 연속된 a|
|a{2,4}| 2~4개 연속된 a|
| a\|b |a 또는 b|

### Anchors	

|expression|description|
|---|---|
|^abc|abc 로 시작|
|abc$|abc 로 끝|
|^abc$|abc 로 시작, 끝|
|\ba|blank 이후에 오는(혹은 문자열의 시작) a|
|\Ba|blank 이후에 오지 않는 a, a 바로 앞에 다른 문자열이 있는 것|

### Groups & Lookaround	

|expression|description|
|---|---|
|(?:abc)|non-capturing group|
|(?=abc)|positive lookahead|
|(?!abc)|negative lookahead|

## 자주 쓰는 Pattern

### Digit

|desc|regex| example|
|---|---|---|
| 자연수 | `/^\d+$/` | 1,2, 123|
| 실수(소수점 필수) | `/^\d*\.\d+$/` | 10.2, .1|
| 실수 | `/^\d+(\.\d+)?$/` | 10, 10.1 |
| 음수 + 실수 | `/^-?\d+(\.\d+)?$/` | -10, -10.1 |

### Alphanumeric
|desc|regex| example|
|---|---|---|
| 알파벳 + 숫자 | `/^[a-zA-Z0-9]*$/`, `/^[\w]*$/` | hello, hello5 |
| 알파벳 + 숫자 + 공백 | `/^[a-zA-Z0-9 ]*$/` | hello world |

...ing

## 테스트 해보기
- https://regexr.com/
- https://www.regexpal.com/