# [HTTP 완벽 가이드] Chap1. HTTP 개관

> HTTP 프로토콜을 간략하게 소개한다.


**목차**
- 얼마나 많은 클라이언트와 통신하는지
- 웹 컨텐츠(리소스)가 어디서 오는지
- 웹 트렌젝션이 어떻게 동작하는지
- HTTP 통신을 위해 사용하는 메시지 형식
- TCP 네트워크 전송

## 1. HTTP: 인터넷 멀티미디어 배달부

- HTTP는 jepg, html, txt, md, mpeg, wav, java, ... 등 다양한 파일을 주고 받을 수 있는 프로도톨이다. 
- HTTP는 신뢰성있는 데이터 전송 프로토콜(TCP)를 사용하기 때문에, 데이터가 꼬이거나 손상되지 않음을 보장한다.

## 2. 웹 클라이언트와 서버

![http_client_server](https://thisblogfor.me/static/1d9bbfb0dc641ccf5fadeb7b78fa11d3/c7805/client-server.png)

- 웹 콘텐츠는 웹서버에 존재한다.
- 웹서버는 http 프로토콜로 의사소통 하기 때문에 보통 http 서버라고 불린다.
- 클라이언트는 http 리퀘스트는 웹서버에 보내고, 웹서버는 클라리언트가 요청한 웹 콘텐츠를 http 응답으로 돌려준다.

## 3. 리소스
![resource](https://www.researchgate.net/profile/Xinggong-Zhang/publication/325866283/figure/fig3/AS:1021742319411201@1620613760989/Network-topology-in-test-bed-in-Fig5-The-HTTP-2-server-and-the-client-are-deployed-on.png)

- 웹 서버는 웹리소스는 관리하고 제공한다.
- 텍스트, 이미지와 같은 정적 파일과 js, 비디오 스트림등 동적 컨텐츠를 포함한다.
- 데이터 베이스에 접근하여 사용자 정보를 가져오거나, 결제 시스템에 접근하여 구매를 API를 호출할 수도 있다.


### 3.1. 미디어 타입
![content_type](https://www.runoob.com/wp-content/uploads/2014/06/F7E193D6-3C08-4B97-BAF2-FF340DAA5C6E.jpg)

- 인터넷은 수천가지의 데이터 타입을 다루기 때문에, http는 웹에서 전송되는 객체 각각에 `MIME(Multipurpose Internet Mail Extensions)` 타입이라는 데이터 포맷 라벨을 붙인다.
- 원래 MIME는 전자 메일 시스템 사이에서 메시지가 오갈 떄 겪는 문제점을 해결하기 위해 설계되었다.
- 웹서버는 모든 http 객체 데이터에 MIME 타입을 붙인다.
- 대부분의 타입은 웹 브라우저에서 기본적으로 제공되며, 그 타입에 맞에 외부 플러그인을 실행하여 오디오등을 재생한다.
- 타입은 `사선(/)` 으로 구분된 주 타입과 부타입으로 이루어진 문자열이다.
```
Content-Type: application/msword
Content-Type: application/pdf
Content-Type: application/vnd.ms-excel
Content-Type: application/x-javascript
Content-Type: application/zip
Content-Type: image/jpeg
Content-Type: text/css
Content-Type: text/html
Content-Type: text/plain
Content-Type: text/xml
Content-Type: text/xsl
```

### 3.2. URI(Uniform Resource Identifier)
![uri_url_urn](https://images.velog.io/images/kjh03160/post/e2b5ca55-33f3-40ea-8fb8-62f5b0b1ed59/image.png)

- 클라이언트는 필요로하는 웹 리소스를 얻기 위해 웹 서버의 리소스에 접근한다.
- 이때 서버에 저장된 리소스의 고유한 식별자를 URI 라고 한다.

### 3.3. URL(Uniform Resource Location)
![uri](https://i0.wp.com/hanamon.kr/wp-content/uploads/2021/09/URL-URN.jpeg?resize=547%2C181&ssl=1)

- 통합 자원 지시자는 리소스 식별자의 가장 흔한 형태이다.
- 리소스가 서버의 어느 위치에 있는지는 정확히 서술한다.
- `http://www.oreilly.com/index.html` -> 오레일리 출판사 홈페이지의 url
- URL은 `프로토콜(스킴) + 서버 도메인 + 리소스 경로` 로 구성된다.

### 3.4. URN(Uniform Resource Name)
- 유니폼 리소스 이름
- URN은 한 리소스에 대해, 위치와 상괸 없이 가지는 유일무이한 이름이다.
- 리소스를 다른 위치로 옮기더라도 동일하며, 어떤 프로토콜로 접근해도 문제없다.
- 예를 들어, 인터넷 표준문서 `[RFC 2141](https://datatracker.ietf.org/doc/html/rfc2141)`은 위치에 상관없이 고유하게 접근할 수 있다.
- URN은 거의 사용하지 않고 있다.

## 4. 트랜잭션
![transaction](https://i.stack.imgur.com/LcdmF.png)
- http 트랜젝션은 요청과 응답으로 구성된다.

### 4.1. 메서드
![method](https://computernetworkingsimplified.files.wordpress.com/2014/01/httpmethods1.jpg)

- Http는 http 메서드라고 불리는 여러 종유의 요청 명령을 지원한다
- 매서드는 서버에게 어떤 동작이 취해져야 하는지를 말해준다.

### 4.2. 상태 코드
![status_code](https://miro.medium.com/max/920/1*w_iicbG7L3xEQTArjHUS6g.jpeg)

- 모든 http 응답 메시지에는 상태코드가 함께 반환된다.
- 상태코드는 요청에 대한 응답의 상태를 의미한다.
- 전체 코드는 [mdn](https://developer.mozilla.org/ko/docs/Web/HTTP/Status) 에서 확인할 수 있다.

### 4.3. 웹 페이지는 여러 객체로 이루어질 수 있다.
![transaction](./http-ch1.assets/transaction.PNG)
- 애플리케이션은 하나의 작업을 수행하기 위해 여러번 http 트랜잭션을 수행한다.
- 보통 웹페이지(ex. www.google.com) 에 접속하면, `index.html` 같은 html 문서를 응답 받는다.
- 이후에 html 문서에 연결된 javascript, 이미지 등을 추가로 http 트랜잭션을 수행한다.
- 추가로 요청되는 리소스들은 다른 서버에 위치 할 수도 있다.

## 5. 메시지
- http 메시지는 단순한 줄 단위의 문자열이다.
- 이진 형식이 아닌 일반 텍스트이기 때문에 사람이 읽고 쓰기 쉽다.
- 클라이언트 -> 서버로 보내는 메시지를 요청 메시지라고 하며, 반대를 응답 메시지라고 한다.
- 요청과 응답 메시지 형태는 거의 비슷하다.

![message](https://docs.trafficserver.apache.org/en/latest/_images/http_headers.jpg)
- 시작줄
  - 요청이라면 무엇을 요청하는지, 
  - 응답이라면 결과가 어떤지를 나타낸다.
- 헤더 
  - 0개 이상의 헤더필드가 있다.
  - 구문분석을 위해 쌍점(:)으로 구분된 key, value로 구성된다.
  - 빈줄로 끝난다.
- 본문
  - 요청의 본문은 웹서버로 데이터를 실어보내며
  - 응답의 본문은 클라이언트로 데이터를 반환한다.
  - 본문은 형식이 없다. 임의의 이진 데이터를 포함할 수 있다.

## 6. TCP 커넥션
- HTTP는 TCP(Transmission Control Protocol)을 사용한다.

### 6.1. TCP/IP
- HTTP는 애플리케이션 계층이다.
- 따라서 HTTP는 네트워크 통신의 핵심적인 세부사항에 대해서는 신경쓰지 않는다.
- 대신 신뢰성있는 인터넷 전송 프로토콜인 TCP를 사용한다.

![osi](https://t1.daumcdn.net/cfile/tistory/995EFF355B74179035)
- TCP는 아래 특징이 있고, 올바른 데이터 송수신을 보장한다.
  - 오류없는 데이터 전송
  - 순서에 맞는 전달
  - 조각나지 않는 데이터스트림
- TCP/IP는 TCP 와 IP가 층을 이루는, 패킷 교환 네트워크 프로토콜의 집합이다.

### 6.2. 접속, IP 주소, 포트 번호
- http 클라이언트가 메시지를 보내기 전에, IP 주소와 포트번호를 사용해 서버와 TCP/IP 커넥션을 맺어야 한다.
- IP 주소는 DNS 를 통해 도메인 네임으로 얻을 수 있다.
- http 는 일반적으로 80번 포트를 사용한다.

### 7. 프로토콜 버전

- 자세한 설명은 [mdn](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP) 에서 확인 할 수 있다.

### HTTP/0.9
- http 초기 버전에는 버전 번호가 없었다.
- HTTP/0.9 는 이후 버전과 구별하기 위해 붙여졌다.
- 단순한 구성이었으며, 요청은 단일 하인으로 구성되었다.
- 가능한 메서드는 `GET` 밖에 없었다.
- 응답도 오로지 파일 내용 자체만 있었다. 멀티미디어 타입이 없었다.

### HTTP/1.0
- 버전 번호, 헤더, 추가 메서드, 멀티미디어 처리가 추가되었다.
- WWW을 대세로 만들었다.
- 잘 정의된 명세는 아니고, 당시에 필요한 사항들을 보완한 정도이다.

### HTTP/1.0+
- 커넥션을 오래 지속하는 `keep-alive`, 가상 호스팅 지원, 프락시 연결 등의 기능을 추가했다.

### HTTP/1.1
- 설계의 구조적 결함 교정, 성능 최적화, 버그 수정
- 더 복잡해진 웹 어플리케이션과 배포를 지원

### HTTP/2.0
- HTTP/1.1 성능문제를 개선하기 위해 구글의 SPDY 프로토콜의 기반으로 설계가 진행중인 프로토콜

## 8. 웹의 구성 요소

- 프락시 : 클라이언트와 서버 사이에 위치한 HTTP 중개자
- 캐시 : 많이 찾는 웹페이지를 클라이언트 가까이에 보관하는 HTTP 창고
- 게이트 웨이 : 다른 애플리케이션과 연결된 특별한 웹서버
- 터널 : 단순히 HTTP 통신을 전달하기만 하는 특별한 프락시

### 8.1. 프락시
![proxy](https://1.bp.blogspot.com/-GQ7bWJydFe4/WWMIJbVC8QI/AAAAAAAASgs/_N1SdagwVlEzyag08kyd3K7HgXN_4gLyQCLcBGAs/s1600/25.jpg)
- 웹 보안, 애플리케이션 통합, 성능 최적화를 위한 중요한 구성요소이다.
- 클라와 서버 사이에 위치하여 클라 대신 http 요청을 서버에 전달한다.(대개 요청을 수정한 뒤에)
- 주로 보안을 위해 사용하며, 신뢰할 만한 중재자 역할을 한다.
- 또한 요청과 응답을 필터링 한다.
- 학교나 회사에서 인터넷을 사용할 때 유해 사이트를 차단하는 역할을 한다.

### 8.2. 캐시
- 웹 캐시와 프락시 캐시는 자신을 거쳐가는 문서들 중에서 자주 찾는 것의 사본을 저장해둔다.
- 서버는 멀고, 캐시에는 금방 접근할 수 있어 빠르게 리소스를 받을 수 있다.

### 8.3. 게이트 웨이
![gateway](https://image.toast.com/aaaadh/real/2019/techblog/1main.png)
- 다른 서버들의 중개자로 동작하는 특별한 서버
- 주로 HTTP 트래픽을 다른 프로토콜로 변환하기 위해 사용된다.
- 게이트웨이는 언제가 스스로가 리소스를 가지고 있는 진짜 서버인것 처럼 요청을 다룬다.
- 클라이언트는 자신이 게이트웨이와 통신하고 있을음을 알아채지 못한다.

### 8.4. 터널
![tunnel](https://blog.devart.com/wp-content/uploads/2015/01/tunneling-dgram.png)
- 두 커넥션 사이의 raw 데이터를 열어보지 않고 그대로 전달해주는 http 애플리케이션.
- 주로 http가 아닌 데이터를 하나 이상의 http 연결을 통해 그대로 전송해주기 위해 사용된다.
- 대표적으로 암호화된 ssl 트래픽을 http 커넥션으로 전송함으로써 웹 트래픽만 허용하는 사내 방화벽을 통과시키는 것이 있다.

### 8.5. 에이전트
- 사용자 에어전트는 사용자를 위해 http 요청을 만들어주는 클라이언트 프로그램이다.
- 대표적으로 웹브라우저가 있지만, 다른 종류도 있다.
- 예를 들면 사람의 통제 없이 스스로 웹을 돌아다니며 http 트랜젝션을 일으키고 콘텐츠를 받아오는 자동화된 사용자 에이전트도 있다.
- `웹로봇` 이라고 불리며, 가격 비교나 웹사이트의 og 태그등을 읽고 검색엔진 미리보기를 보여주는 역할을 한다.