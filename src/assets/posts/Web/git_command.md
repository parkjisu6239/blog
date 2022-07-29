# 맨날 까먹는 Git 명령어 정리

## TL;DR
```bash
git rebase -i HEAD~<n> // 인터렉티브 리베이스 : 스쿼시, 커밋 메시지 수정 등에 사용
git merge --abort // merge 진행 중 취소
git reset --hard HEAD // 변경 사항 모두 버리고 HEAD로 돌아가기(stage에도 남지 않음)
git revert -m 1 <merge_commit> // merge 완료 후 취소(바로 이전 커밋으로 돌아가기)
git cherry-pick <commit 이름> // 특정 커밋 가져오기
git reset --soft HEAD~1 // 이전 커밋으로 돌아가기, 변경 사항은 stage에 남음
git checkout -t <remote branch name> // remote 브랜치 가져오기
```

### Commit squash, 커밋 합치기

HEAD로부터 n개의 커밋을 병합하려는 경우

```bash
git rebase -i HEAD~<n>
```
<details>
<summary>자세히 보기</summary>  
- `i` 옵션은 interactive로 HEAD 이전의 i를 다양한 옵션으로 수정할 수 있다.
- 위 명령어를 입력하면 아래처럼 인터렉티브 하게 수정이 가능하다.

```bash
pick b91e257 first commit
pick 0118d46 second commit
pick 1f199b7 third commit

# Rebase db078da..1f199b7 onto db078da (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log messag
```

- Insert 모드로 진입하여 `pick` 이라고 나와있는 부분을 아래 `commands` 에 따라 `s` 또는 `squash` 로 변경하면 된다.
- 원하는 커밋을 모두 수정했으면 수정모드를 빠져나온다.

- 완료되면 스쿼시한 커밋을 합친 커밋 메시지를 어떻게 수정할건지 물어본다.
- 만약 위 과정이 수행되지 않으면 `git rebase --continue` 로 이어서 진행 할 수 있다.

> 크라켄등 GUI 툴로 하면 간단히 선택으로 스쿼시가 가능하다. 그런데 다른 브랜치를 pull 받은 후에는 크라켄에서 스쿼시가 안되기 때문에 꼭 알아둬야한다.
</details>




## Merge 취소

pull 받거나 merge 했더니 충돌나서 이전으로 돌아가고 싶을 때, 브랜치 뒤에 `>m<` 으로 나와있고 merge 진행중일때 취소하는 방법. 수정을 원치 않을 때 사용한다.

```bash
git merge --abort
```


중간에 수정 좀 하다가(일부 resolve 된 경우), 변경사항이 staging에 올라간 경우 취소할 때.

```bash
git reset --hard HEAD
```



merge 됐는데 아예 바로 전 상태로 롤백하고 싶을 때

```bash
git revert -m 1 <merge_commit>
```



## 다른 브랜치의 Commit 가져오기

특정 커밋 상태 하나만 가져오기, 해당 브랜치의 가장 최신이 아니어도 된다.

```bash
git cherry-pick <commit 이름>
```

checkout은 그 브랜치로부터 새로운 브랜치를 따는 것. 체리픽 처럼 사용하려면 소스 브랜치의 head를 원하는 커밋으로 변경하고 나서 checkout 해야한다.

## Commit to staging
```bash
git reset --soft HEAD^
git reset --soft HEAD~1 // hard 로 하면 stage 에도 남지 않음
```

## Remote branch pull
원격 저장소의 특정 브랜치를 가져올 떄 사용
```bash
git remote update // remote branch 갱신

git checkout -t <branch name>
```