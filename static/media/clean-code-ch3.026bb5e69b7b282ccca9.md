# [Clean Code] Chap3. 함수

> 챕터 2에서는 좋은 함수를 만드는 방법을 제시한다.

## TI;DL  
- 작게 만들어라
- 한 가지만 해라
- 함수 당 추상화 수준은 하나로
- Switch문  
- 서술적인 이름을 사용하라
- 함수 인수   
- 부수 효과를 일으키지 마라
- 명령과 조회를 분리하라
- 오류코드보다 예외를 사용하라
- 반복하지마라
- 구조적 프로그래밍  



## 작게 만들어라

함수를 만들 때 최대한 ‘작게’ 만들어라.
```java
// Good 👍
public static String renderPageWithSetupsAndTeardowns( PageData pageData, boolean isSuite) throws Exception {
	boolean isTestPage = pageData.hasAttribute("Test"); 
	if (isTestPage) {
		WikiPage testPage = pageData.getWikiPage(); 
		StringBuffer newPageContent = new StringBuffer(); 
		includeSetupPages(testPage, newPageContent, isSuite); 
		newPageContent.append(pageData.getContent()); 
		includeTeardownPages(testPage, newPageContent, isSuite); 
		pageData.setContent(newPageContent.toString());
	}
	return pageData.getHtml(); 
}
```
 위 코드도 충분히 짧아보이지만, 권장사항은 3~5줄 내외로 줄이는 것이다.
 ```java
// Good 👍👍
public static String renderPageWithSetupsAndTeardowns( PageData pageData, boolean isSuite) throws Exception { 
	if (isTestPage(pageData)) 
		includeSetupAndTeardownPages(pageData, isSuite); 
	return pageData.getHtml();
}
```

### 블록과 들여쓰기  
중첩구조(if/else, while문 등)에 들어가는 블록은 한 줄이어야 한다. 각 함수 별 들여쓰기 수준이 2단을 넘어서지 않고,  각 함수가 명백하다면 함수는 더욱 읽고 이해하기 쉬워진다.
즉, 중첩 구조가 생길만큼 함수가 커져서는 안된다는 이야기이다.


## 한 가지만 해라  

함수는 한가지를 해야 한다. 그 한가지만 잘 해야 한다. 지정된 함수 이름 아래에서 추상화 수준이 하나인 단계만 수행한다면 그 함수는 한 가지 작업만 하는 것이다.

### 함수 내 섹션  
함수를 여러 섹션으로 나눌 수 있다면 이미 그 함수는 여러작업을 하는 셈이다. 한 가지만 하는 함수는 자연스럽게 섹션으로 구분하기 어려워진다.


## 함수 당 추상화 수준은 하나로
함수가 ‘한가지’ 작업만 하려면 함수 내 모든 문장의 추상화 수준이 동일해야 된다.  만약 한 함수 내에 추상화 수준이 섞이게 된다면 읽는 사람이 헷갈린다.

### 위에서 아래로 코드 읽기 : *내려가기 규칙*
코드는 위에서 아래로 이야기처럼 읽혀야 좋다.  함수 추상화 부분이 한번에 한단계씩 낮아지는 것이 가장 이상적이다.(내려가기 규칙)


## Switch문
`switch` 문은 본질적으로 작게 만들기 어렵고, 한가지만 하지도 않는다. 하지만 `switch` 문을 완전히 피할 방법은 없다.
```java
public Money calculatePay(Employee e) throws InvalidEmployeeType {
	switch (e.type) { 
		case COMMISSIONED:
			return calculateCommissionedPay(e); 
		case HOURLY:
			return calculateHourlyPay(e); 
		case SALARIED:
			return calculateSalariedPay(e); 
		default:
			throw new InvalidEmployeeType(e.type); 
	}
}
```

다형성을 이용하여 switch문을 abstract factory에 숨겨, 다형적 객체를 생성하는 코드 안에서만 switch를 사용하도록 한다. 

```java
public abstract class Employee {
	public abstract boolean isPayday();
	public abstract Money calculatePay();
	public abstract void deliverPay(Money pay);
}
-----------------
public interface EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType; 
}
-----------------
public class EmployeeFactoryImpl implements EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
		switch (r.type) {
			case COMMISSIONED:
				return new CommissionedEmployee(r) ;
			case HOURLY:
				return new HourlyEmployee(r);
			case SALARIED:
				return new SalariedEmploye(r);
			default:
				throw new InvalidEmployeeType(r.type);
		} 
	}
}
```


## 서술적인 이름을 사용하라!  
> “코드를 읽으면서 짐작했던 기능을 각 루틴이 그대로 수행한다면 깨끗한 코드라 불러도 되겠다” - 워드

작은 함수는 그 기능이 명확하므로 이름을 붙이기가 더 쉬우며, 일관성 있는 서술형 이름을 사용한다면 코드를 순차적으로 이해하기도 쉬워진다.

## 함수 인수 
함수에서 이상적인 인수 개수는 `0개(무항) > 1개(단항) >> 2항 >>>>>>>>>>> 3,4,....` 이다. 인수가 3개 이상이라면 반드시 특별한 이유가 필요하다.

출력인수(함수의 반환 값이 아닌 입력 인수로 결과를 받는 경우)는 이해하기 어려우므로 웬만하면 쓰지 않는 것이 좋다.

### 많이 쓰는 단항 형식  
  - 인수에 질문을 던지는 경우 `boolean fileExists(“MyFile”);`  
  - 인수를 뭔가로 변환해 결과를 변환하는 경우 `InputStream fileOpen(“MyFile”);`  
  - 이벤트 함수일 경우

위의 3가지가 아니라면 단항 함수는 가급적 피하는 것이 좋다.

### 플래그 인수  
플래그 인수는 추하다. 쓰지마라. bool 값을 넘기는 것 자체가 그 함수는 한꺼번에 여러가지 일을 처리한다고 공표하는 것과 마찬가지다.

### 이항 함수  
단항 함수보다 이해하기가 어렵다. 단, Point 클래스의 경우에는 이항 함수가 적절하다. x, y 좌표이기 때문. `Point p = new Point(x,y);`

인수가 둘 이상이라면, 2개의 인수간의 자연적인 순서가 있어야 한다. 

### 삼항 함수  
이항 함수보다 이해하기가 훨씬 어려우므로, 위험도 2배 이상 늘어난다. 삼항 함수를 만들 때는 신중히 고려하라.

### 인수 객체  
인수가 많이 필요할 경우, 일부 인수를 독자적인 클래스 변수로 선언할 가능성을 살펴보자
x,y를 인자로 넘기는 것보다 Point를 넘기는 것이 더 낫다.
```ts
// Bad ❌
const makeCircle = (x, y, radius) => {}

// Good 👍
const makeCircle = (point: Point, radius) => {}
```

### 인수 목록  
때로는 String.format같은 함수들처럼 인수 개수가 가변적인 함수도 필요하다. 사실 String.format의 인수는 List형 인수이기 때문에 이항 함수라고 할 수 있다.

### 동사와 키워드
단항 함수는 함수와 인수가 동사/명사 쌍을 이뤄야한다. `writeField(name);`  

함수이름에 키워드(인수 이름)을 추가하면 인수 순서를 기억할 필요가 없어진다. `assertExpectedEqualsActual(expected, actual);`  

## 부수 효과를 일으키지 마라
부수효과는 거짓말이다. 함수에서 한가지를 하겠다고 약속하고는 남몰래 다른 짓을 하는 것이므로, 한 함수에서는 딱 한가지만 수행할 것!

아래 코드에서 `Session.initialize();`는 함수명과는 맞지 않는 부수효과이다.
```java
// Bad ❌
public class UserValidator {
	private Cryptographer cryptographer;
	public boolean checkPassword(String userName, String password) { 
		User user = UserGateway.findByName(userName);
		if (user != User.NULL) {
			String codedPhrase = user.getPhraseEncodedByPassword(); 
			String phrase = cryptographer.decrypt(codedPhrase, password); 
			if ("Valid Password".equals(phrase)) {
				Session.initialize();
				return true; 
			}
		}
		return false; 
	}
}
```

이 경우에는 함수 이름을 `checkPasswordAndInitializeSession` 으로 변경하거나(그래도 함수는 여전히 두가지 일을 한다.) 분리하자.
```js
// Good 👍
checkPassword()
.then(result => {
	if (result) {
		// ...
	} else {
		Session.initialize();
	}
})

// Good 👍
if (user.isValidPassword()) {
	// ...
} else {
	Session.initialize();
}

```


### 출력인수  
일반적으로 출력 인수는 피해야 한다. 함수에서 상태를 변경해야 한다면 함수가 속한 객체 상태를 변경하는 방식을 택하라.

## 명령과 조회를 분리하라
함수는 뭔가 객체 상태를 변경하거나, 객체 정보를 반환하거나 둘 중 하나다. 둘 다 수행해서는 안 된다.  
`public boolean set(String attribute, String value);`같은 경우에는 속성 값 설정 성공 시 true를 반환하므로 괴상한 코드가 작성된다.  
`if(set(“username”, “unclebob”))...` 그러므로 명령과 조회를 분리해 혼란을 주지 않도록 한다.  

## 오류코드보다 예외를 사용하라!

try/catch를 사용하면 오류 처리 코드가 원래 코드에서 분리되므로 코드가 깔끔해 진다.

### Try/Catch 블록 뽑아내기  

```java
if (deletePage(page) == E_OK) {
	if (registry.deleteReference(page.name) == E_OK) {
		if (configKeys.deleteKey(page.name.makeKey()) == E_OK) {
			logger.log("page deleted");
		} else {
			logger.log("configKey not deleted");
		}
	} else {
		logger.log("deleteReference from registry failed"); 
	} 
} else {
	logger.log("delete failed"); return E_ERROR;
}
```

정상 작동과 오류 처리 동작을 뒤섞는 추한 구조이므로 if/else와 마찬가지로 블록을 별도 함수로 뽑아내는 편이 좋다.

```java
public void delete(Page page) { // try/catch 만 있는 함수
	try {
		deletePageAndAllReferences(page);
  	} catch (Exception e) {
  		logError(e);
  	}
}

private void deletePageAndAllReferences(Page page) throws Exception { // 실제로 페이지를 제거하는 함수
	deletePage(page);
	registry.deleteReference(page.name); 
	configKeys.deleteKey(page.name.makeKey());
}

private void logError(Exception e) { 
	logger.log(e.getMessage());
}
```

오류 처리도 한가지 작업이다.

### Error.java 의존성 자석

```java
public enum Error { 
	OK,
	INVALID,
	NO_SUCH,
	LOCKED,
	OUT_OF_RESOURCES, 	
	WAITING_FOR_EVENT;
}
```

오류를 처리하는 곳곳에서 오류코드를 사용한다면 enum class를 쓰게 되는데 이런 클래스는 의존성 자석이므로, 새 오류코드를 추가하거나 변경할 때 코스트가 많이 필요하다.
그러므로 예외를 사용하는 것이 더 안전하다.

## 반복하지 마라!  
중복은 모든 소프트웨어에서 모든 악의 근원이므로 늘 중복을 없애도록 노력해야한다.

## 구조적 프로그래밍  
다익스트라의 구조적 프로그래밍의 원칙을 따르자면 모든 함수와 함수 내 모든 블록에 입구와 출구가 하나여야 된다. 즉, 함수는 return문이 하나여야 되며, 

**루프 안에서 break나 continue를 사용해선 안된며 goto는 절대로, 절대로 사용하지 말자.** 함수가 클 경우에만 상당 이익을 제공하므로, 함수를 작게 만든다면 오히려 여러차례 사용하는 것이 함수의 의도를 표현하기 쉬워진다.

그런데 구조적 프로그래밍의 목표와 규율은 공감하지만 함수가 작다면 위 규칙은 별 이익을 제공하지 못한다. 함수가 아주 클 때만 상당한 이익을 제공한다. 그러므로 함수를 작게 만든다면 간혹 return, break, continue를 사용해도 괜찮다. 오히려 때로는 단일 입/출구 규칙보다 의도를 표현하기 쉬워진다.

## 함수를 어떻게 짜죠?  
처음에는 길고 복잡하고, 들여쓰기 단계나 중복된 루프도 많다. 인수목록도 길지만, 이 코드들을 빠짐없이 테스트하는 단위 테스트 케이스도 만들고, 
코드를 다듬고, 함수를 만들고, 이름을 바꾸고, 중복을 제거한다. 처음부터 완벽할 수는 없다.