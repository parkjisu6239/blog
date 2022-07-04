# github Blog
## Command

### Run

```
npm start
```

로컬에서 실행합니다. [http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### Deployment

```
npm run deploy
```
github.io 에 배포합니다. `package.json`의 `homepage`와 github repo name을 동일하게 설정해야 합니다.

## How to Post

1. `src/assets/posts` 에 폴더 또는 파일을 생성합니다.
  - 파일은 반드시 markdown 형식이어야 합니다.
  - 파일, 폴더 명의 띄어쓰기 없이 작성해야 합니다. 띄어쓰기 대신 `-` 를 사용할 수 있습니다.
  - 폴더를 생성한 경우, 폴더 안에 `README.md` 를 생성합니다. 여기엔 해당 폴더의 간단한 설명을 작성할 수 있습니다.
2. `src/assets/posts/info.js` 에 내용을 추가합니다.
  - 폴더를 추가한 경우, `postInfo`의 `key`를 생성한 폴더명과 동일하게 추가합니다.
  - 폴더(key)의 `value` 는 post List 로 파일 설명을 추가합니다.
  - 예시를 보고 동일한 규칙으로 생성합니다.
3. `npm run deploy` 로 배포합니다.

## eslint
- `npm i eslint` 로 eslint 설치
- `npx eslint --init` 으로 eslint.json 생성
- pakage.json의 devDependence 참고하여 플러그인 추가 설치
- vscode setting > code action on save > Edit in setting.json 에 아래 설정 추가
```json
"editor.codeActionsOnSave": {
    "source.fixAll": true,
},
"editor.formatOnSave": false,
```

## 참고한 글
- [Adding dynamic meta tags to a React app without SSR
](https://blog.logrocket.com/adding-dynamic-meta-tags-react-app-without-ssr/)


## todo
- toc 지원
- 이미지 경로 설정, 이미지 랜더 지원
- 포스트 내부에서 이전글, 다음글 지원