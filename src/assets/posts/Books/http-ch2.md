# [HTTP 완벽 가이드] Chap2. URL과 리소스

> URL을 구성하는 컴포넌트를 설명한다.


**목차**
- URL 문법, URL 컴포넌트
- 상대 URL, 확장 URL, 단축 URL
- URL의 인코딩과 문자 규칙
- URL 공통 스킴
- URN, URL의 미래

## 1. 인터넷의 리소스 탐색하기
- URL은 브라우저가 정보를 찾는데 필요한 리소스의 위치를 가르킨다.
- 사용자는 브라우저에 URL을 입력하고, 브라우저는 원하는 리소스를 얻기 위해서 적절한 프로토콜을 사용하여 메시지를 전송한다.

### 1.1. URL이 있기 전 암흑의 시대
- 과거에는 약속된 규칙이 별도로 없어, 애플리케이션 마다 각기 다른 분류방식을 가졌다.
- 현재는 URL이 어떤식으로 구성되고, 브라우저가 이 리소스를 어떻게 가져오는지 몰라도 된다.
- 브라우저가 프로토콜에 맞게 리소스를 요청하고, 보여주고 있다.

## 2 URL 문법
```
<스킴>://<사용자 이름>:<비밀번호>@<호스트>:<포트>/<경로>;<파라미터>?<질의>#<프래그먼트>
```

| 컴포넌트 | 설명 | 기본값 |
|-----|-----|-----|
| 스킴 | 리소스를 가져오기 위한 프로토콜 | 없음 |
|사용자 이름| 일부 리소스는 로그인이 필요하다|anonymous|
|비밀번호|사용자의 비밀번호, 사용자 이름에 콜론(:)으로 이어서 기술한다.|<이메일 주소>|
|호스트|도메인 또는 IP 주소|없음|
|포트|서버가 열어둔 포트 번호|스킴에 따라 다름|
|경로|이전 컴포넌트와 빗금(/)으로 구분되며, 서버 내에 리소스가 어디에 있는지 의미한다.|없음|
|파라미터|특정 스킴에서 파라미터를 사용하는 경우 이름/값을 쌍으로 가지며 세미콜론(;)으로 구분된다.|없음|
|질의 | 스킴에서 애플리케이션에 파라미터를 전달하는데 쓰인다. 이전 컴포넌트와 물음표(?)로 구분되며, 여러개일 경우 엔드(&)로 연결하여 `이름=값`을 쌍으로 가진다.|없음|
|프래그먼트|리소스나 조각의 일부, 클라이언트에서만 사용한다. 샵(#)으로 구분된다.|없음|

### 2.1. 스킴 : 사용할 프로토콜
- 어떤 프로토콜을 사용하여 리소스를 요청해야하는지 알려준다.
- 알파벳으로 시작해야하고, 뒷 부분과 콜론(:)으로 구분된다.
- 대소문자를 가리지 않는다.

### 2.2 호스트와 포트
- 리소스를 호스팅하고 있는 장비, 그 장비 내에서 리소스에 접근할 수 있는 서버가 어디에 있는지를 의미한다.
- 호스트는 도메인, IP 둘다 사용할 수 있다.
- 포트는 서버가 열어놓은 네트워크 포트를 가리킨다.
- http는 80, https는 443 포트가 기본값이다.

### 2.3 사용자 이름과 비밀번호
- 일부 프로토콜은 사용자의 이름과 비밀번호를 요구한다.
- ftp 서버가 대표적이다. (aws 콘솔에 접근할 때 사용하곤 한다.)
- 사용자 이름은 `anonymous` 를 기본값으로 가지고, 비밀번호의 기본값은 브라우저마다 다르다.

### 2.4 경로
- 리소스가 서버의 어디에 있는지 나타낸다.
- 계층적 파일 시스템 경로와 유사한 구조를 가진다.
- 빗금(/)을 기준으로 경로 조각으로 나뉜다.
- 각 경로조각은 자체만의 파라미터 컴포넌트를 가질 수 있다.

### 2.5 파라미터
- 애플리케이션이 서버에 정확한 요청을 하기 위해 필요한 입력 파라미터를 받는데 사용한다.
- 이름/값 쌍의 리스트로 URL 나머지 부분들로부터 세미콜론(;)으로 구분한다.
- 이를 통해 리소스에 접근하는데 필요한 어떤 추가 정보든 전달할 수 있다.

### 2.6 질의 문자열
- DB 서비스는 리소스 형식의 범위를 좁히기 위해서 질의를 받을 수 있다.
- `https://www.google.com/search?q=apple`
- `http://www.joes-hardware.com/inventory-check.cgi?item=12731`
- 물음표(?)로 앞쪽 컴포넌트와 구분되며 엔드(&)로 나뉜 `이름=값` 쌍 형식의 질의 문자열로 구성된다.

### 2.7 프래그먼트
- html 같은 리소스 형식들은 본래의 수준보다 더 작게 나뉠 수 있다.
- 절(paragraph)이 포함된 문서의 특정 특정 구절을 가리킬 수 있다. (ex. https://www.typescriptlang.org/docs/handbook/intro.html#how-is-this-handbook-structured)
- 앞쪽 컴포넌트와 샵(#)으로 구분된다.
- 일반적으로 서버는 http 전체를 다루기 때문에, 클라이언트는 서버에게 프래그먼트를 전달하지 않는다.
- 프래그먼트는 클라이언트가 처리한다.

## 3. 단축 URL
- 웹 클라이언트는 몇몇 단축 URL을 인식하고 사용한다.
- 상태 URL은 리소스를 간결하게 기술할 수 있다.
- 대부분의 브라우저는 `URL 자동확장`을 지원한다.

### 3.1. 상대 URL
- URL은 상대 URL과 절대 URL로 나뉜다.
- 절대 URL은 리소스에 접근하기 위한 필요한 모든 정보를 가지고 있다.
- 상대 URL은 모든 정보를 담고 있지 않으며, baseURL이 필요하다.
- `./image.png` 가 상대 URL의 예시이다. 스킴과 호스트를 다 입력하지 않더라도 특정 리소스에서 상대 URL을 사용하면, baseURL을 통해 절대 URL을 만들어서 참조한다.
- 브라우저는 상대 URL과 절대 URL 간에 상호변환을 할 수 있어야 한다.
- 상대 URL을 사용하면 문서 집합의 위치를 변경하더라도 새로운 baseURL에 의해서 해석되어 바꾸지 않아도 된다.

#### baseURL
- 변환과정의 첫 단계는 baseURL을 찾는 것이다.
  - 리소스에서 명시적으로 제공 : html 문서 내에서 <BASE> 태그로 기술한다.
  - 리소스를 포함하고 있는 기저 URL
  - 기저 URL이 없는 경우 : 절대 URL로만 이루어진 것이거나, 깨진 URL

#### 상대 참조 해석하기
- 상대 URL을 절대 URL로 변환하기 위한 단계는 각각을 컴포넌트로 나누는 것이다. 이것을 `URL 분해하기`라고 부른다.
- 이후 알고리즘을 통해 URL을 변환한다.

![url_convert](https://flylib.com/books/1/2/1/html/2/023_files/image002.gif)

### 3.2. URL 확장
- 대부분의 브라우저는 url의 일부만 입력하면 자동으로 url이 확장되는 기능을 제공한다.
  - 호스트명 확장 : 휴리스틱만을 사용하여, 프로토콜이나, `www`나, `com` 을 안붙여도 자동으로 완성해주는 기능
  - 히스토리 확장 : 이전에 방문했던 url의 일부만 입력하면 자동완성되는 기능

## 4. 안전하지 않은 문자
- url은 인터넷의 모든 리소스가 잘 전달될 수 있도록, 유일한 이름으로 설계 되었다.
- 정보 유실의 위험 없이 url을 전송할 수 있게 안전하게 전송되고자 하였다.
- url은 작고 일반적으로 안전한 알파벳 문자만 포함하도록 허락한다.
- 모든 인터넷 프로토콜로 url이 전송되기를 바랬고, 가독성 있기를 바랬기 때문에 url은 일부 문자만 허용된다.
- 이진데이터, 알파벳 외의 문자를 허용하기 위해 `이스케이프` 기능을 추가했다.

### 4.1. URL 문자 집합
- url은 US-ASCII 를 사용한다.
- US-ASCII는 오래되었고, 다국적언어는 지원되지 않는다.
- URL에 다양한 문자 지원을 위해 아스키코드에서 금지된 문자들로 이스케이프 문자열을 사용함으로써 이동성과 완성도를 높였다.

### 4.2. 인코딩 체계
- url에있는 안전하지 않은 문자들을 퍼센트(%)로 시작하게 하여 이스케이프 문자로 바꾼다.
- 대표적으로 빈칸(space)는 `%20`으로 인코딩된다.


### 4.3. 문자 제한
- 몇몇 문자는 url에서 특별한 의미로 예약되어 있기 때문에 사용이 불가능하거나, 이스케이프 문자로 인코딩 된다.

|문자 | 선점 및 제한|
|----|-----|
|%|인코딩된 문제에 사용할 이스케이프 토큰으로 선점|
|/|경로 컴포넌트에 있는 경로 세그먼트를 나누는 용도로 선점|
|.|경로 컨포넌트로 선점|
|..|경로 컨포넌트로 선점|
|#|프레그먼트 구획문자로 선점|
|?|질의 문자열 구획문자로 선점|
|;|파라미터 구획문자로 선점|
|:|스킴, 사용재 이름/비밀번호, 호스트/포트 의 구획문자로 선점|
|$,+|선점|
|@&=|특정스킴에서 특별한 의미가 있기 때문에 선점|
|{}|\•~[]`|
게이트웨이와 같은 여러 전송 에이전트에서 불안전하게 사용되기 때문에 제한됨|
|<>"|
안전하지 않음. URL 범위 밖에서 역활이 있는 문자로 반드시 인코딩해야 한다.|
|0x00-0x1F, 0x7F|제한됨.US-ASCII이지만 인쇄돠지 않는 문자로 제한됨|
|> 0x7F|제한됨. US-ASCII문자가 아니다.|

### 4.4. 좀 더 알아보기
- 예전에 안전하지 않은 문자를 url에 사용했어도 아무 문제가 없었던 것이 의아할 것이다.
- 안전하지 않은 문자열은 어떤 프로토콜에서는 문제가 되지 않는다.
- 하지만 개발자들이 이를 인코딩하지 않은 것은 문제이다.
- 잠재적으로 문제가 될 수 있기 때문에, 모든 url을 안전하게 인코딩 하는 것이 좋다.

## 5. 스킴의 바다
- 인터넷상에는 다양한 프로토콜이 있고, 프로토콜마다 사용하는 컴포넌트에 약간씩 차이가 있다.
- 교재를 참고하자.

## 6. 미래
- url은 강력하다.
- url은 세상에 존재하는 모든 객체에 이름을 지을 수 있고 새로운 포맷을 쉽게 추가할 수 있다.
- 하지만 url은 이름이 아닌 주소이기 때문에, 리소스의 위치가 변경되면 더는 사용할 수 없다.
- 이 문제를 해결하기 위해서는 위치에 상관없이 접근 가능한 이름이 필요하고, 이러한 움직임으로 URN이 고안된 것이다.
- 지속 통합 자원 지시자(PURL)을 사용하면 url로 urn 기능을 제공할 수 있다. 중개서버를 두는식으로 구현한다.

### 6.1. 지금이 아니면, 언제?
- 한동안 urn 방식이 활용되었지만, 아직까지는 url이 비교 불가할 정도로 우세하다.
- url은 urn으로 바꾸는 것은 매우 큰 작업니다.
- 표준화는 중요하므로 느리게 진행될 때도 있다.