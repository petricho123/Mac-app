# 작심삼일 맥북 앱 빌드

1. GitHub의 기존 studytime 저장소 최상위에서 **Add file → Upload files**를 누릅니다. 압축을 푼 파일 중 `mac-app` 폴더를 드래그해 커밋합니다. 업로드 목록에 `mac-app/package.json`과 `mac-app/web/index.html`이 보이는지 확인합니다.
2. 저장소의 **Add file → Create new file**에서 이름을 `.github/workflows/build-mac.yml`로 입력합니다. 이 압축에 있는 `build-mac.yml`을 열고 전체 내용을 붙여넣어 커밋합니다.
3. **Actions → Build macOS App**에서 새 실행을 엽니다. 직접 실행하려면 **Run workflow → main → Run workflow**를 누릅니다.
4. 실행이 성공하면 **Artifacts → ThreeDayStudy-macOS-arm64**를 내려받습니다. ZIP 안의 `ThreeDayStudy-macOS-arm64.zip`도 풀고 `ThreeDayStudy.app`을 응용 프로그램 폴더에 옮깁니다.

맥북 M1 등 Apple Silicon용 빌드입니다. 앱은 로컬 파일로 동작하고, 기존 안드로이드 기록은 JSON 백업을 가져와 옮길 수 있습니다.
Apple 개발자 인증서와 공증을 설정하지 않은 개인용 빌드입니다.
