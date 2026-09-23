# TEUM 무료 배포

TEUM은 Cloudflare Workers Free + SQLite-backed Durable Objects 구조로 배포할 수 있습니다.

Cloudflare 공식 문서 기준 Workers Free는 하루 100,000 요청, SQLite-backed Durable Objects도 Free에서 사용할 수 있으며 Free 계정은 신용카드 없이 시작할 수 있습니다.

## 배포

1. https://dash.cloudflare.com/ 에서 Free 계정을 만듭니다.
2. Workers & Pages로 이동합니다.
3. Create application → Workers → Git repository 연결을 선택합니다.
4. GitHub 계정 연결 후 `hojuy0921/teum` 저장소를 선택합니다.
5. 저장소의 `wrangler.jsonc`를 감지하면 그대로 배포합니다.
6. 배포가 끝나면 Cloudflare가 `workers.dev` 주소를 제공합니다.

주의: Free 플랜에는 사용량 한도가 있습니다. 한도를 넘으면 해당 사용량 유형이 리셋될 때까지 요청이 실패할 수 있습니다. 초기 서비스 운영에는 적합하지만, 사용자가 크게 늘면 유료/확장 인프라로 전환해야 합니다.
