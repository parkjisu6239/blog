# 웹 워커 사용하기

> [mdn](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Introducing_workers) 의 설명과 예시를 참고했다.

웹워커는 웹컨텐츠를 백그라운드 스레드에서 실행할 수 있도록하는 API이다. 시간이 오래걸리는 동기작업을 메인 스레드에서 수행하면, UI 조작이 불가능하다. 이런 경우를 위해 별도의 스레드에서 작업 시간이 긴 작업을 실행시키고, 완료되면 메인 스레드로 메시지를 보낸다. 메인 스레드는 작업을 맡겨둔 후, 메인 스레드의 작업을 진행하다 메시지를 수신하면 멈춤없이 화면에 결과를 표시할 수 있다.

비동기 작업과는 다르며, 웹워커를 사용하는 목적은 `시간이 오래 걸리는 동기 작업을 별도의 스레드에서 실행하므로서 메인 스레드의 플로우를 방해하지 않는다` 에 있다.

## Dedicated worker
단일 스크립트 인스턴스에서 사용되는 가장 간단한 워커이다.

### 예시
```js
//main.js (메인 스레드)

// url을 generate.js로 하는 새로운 워커를 생성한다.
// 브라우저에 따라 지원하지 않는 경우도 있어서, if (window.Worker) {} 로 래핑하는 것이 좋다.
const worker = new Worker('./generate.js');

// 버튼을 클릭한 경우, 입력된 소수를 worker에 메시지로 보낸다.
// 수신하는 쪽에서도 동일한 데이터 구조를 가져야 한다.
document.querySelector('#generate').addEventListener('click', () => {
  const quota = document.querySelector('#quota').value;
  worker.postMessage({
    command: 'generate',
    quota: quota
  });
});

// 워커가 메인 스레드로 응답을 돌려주면, 그 결과를 화면에 표시한다.
worker.addEventListener('message', message => {
  document.querySelector('#output').textContent = `Finished generating ${message.data} primes!`;
});
```

```js
// generate.js (워커)

// message 를 수신한다.
addEventListener("message", message => {
  if (message.data.command === 'generate') {
    generatePrimes(message.data.quota);
  }
});

// 소수만들기 (오래 걸림)
function generatePrimes(quota) {

  function isPrime(n) {
    for (let c = 2; c <= Math.sqrt(n); ++c) {
      if (n % c === 0) {
          return false;
       }
    }
    return true;
  }

  const primes = [];
  const maximum = 1000000;

  while (primes.length < quota) {
    const candidate = Math.floor(Math.random() * (maximum + 1));
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
  }

  // 소수 생성이 완료되면, 메시지를 전송한다. 단일스레드이므로 특정 대상에게 전송하는 것이 아니라, 브로드하게 한다.
  postMessage(primes.length);
}
```

1. 버튼 클릭
2. 메인 스레드 -> 웹워커 : quota 전송
3. 웹워커 : 메시지를 수신하여, 소수 만들기 시작
4. 메인 스레드는 중단되지 않고, 사용자의 다른 요청을 받을 수 있음.
5. 웹워커 -> 메인 스레드 : 계산을 완료하여 결과를 전송
6. 메인 스레드 : 메시지 이벤트리스너가 이를 잡아서, 결과를 화면에 표시

### 나머지 method

```js
// addEventListener('message', ~)와 동일하다.
myWorker.onmessage = function(e) {
  ...
}

// 메인 스레드에서 워커를 즉시 종료시킨다. (위 예시에서 main.js 에서 사용)
myWorker.terminate();

// 웹 워커 스스로 즉시 종료한다. (위 예시에서 generate.js 에서 사용)
close();
```

### 오류 처리
```js
// addEventListener('error', ~)와 동일하다.
myWorker.onerror = function(e){
  ...
}
```

```ts
interface AbstractWorker {
    onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null;
    ...
}

interface ErrorEvent extends Event {
  readonly colno: number;
  readonly error: any;
  readonly filename: string; // 오류가 발생한 스크립트 파일의 이름
  readonly lineno: number; // 오류가 발생한 스크립트 파일의 줄 번호
  readonly message: string; // 사람이 읽을 수 있는 오류 메시지
}
```

### 비고
- 웹워커의 url도 CORS 규칙을 따른다. 외부 url에는 접근할 수 없다.
- 하위작업자를 생성할 수 있는데, 상위 페이지와 동일한 출처 내에서 호스팅되어야 한다.
- 하위 작업자의 URI는 소유페이지가 아닌 상위 작업자의 위치를 기준으로 확인된다.

## Shared Worker
...

## 같이 보기
- [Using web workers](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Using service workers](https://developer.mozilla.org/ko/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [Web workers API](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API)