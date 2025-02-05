# Volgistics API Client

This is a client for the Volgistics API, built in TypeScript. 
It is designed to be used with a organization within the [Volgistics](https://www.volgistics.com/) volunteer platform.

## Installation

```bash
yarn add volgistics-api-client
```

## Usage

## Initialize

#### ESM
```ts
import { VolgisticsClient } from 'volgistics-api-client';

const client = new VolgisticsClient({ orgId: '1234' });

client.login({ email: 'example@example.com', password: 'blah1234' });
```

#### CommonJS
```ts
const { VolgisticsClient } = require('volgistics-api-client');

const client = new VolgisticsClient({ orgId: '1234' });

client.login({ email: 'example@example.com', password: 'blah1234' });
```

### Available methods

#### Get schedule
Retrieves schedule entries for a given date. Optionally filter entries by title prefix.
```ts
const schedule = await client.getSchedule({
  date: '2025-01-01',
  // prefix: 'Volunteer Services'
});
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request and request a review from @pooh-bear.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
GitHub [@pooh-bear](https://github.com/pooh-bear)

## Disclaimer
This API client is a user-maintained project and is in no way affiliated with Volgistics. 
Usage of this client is subject to Volgistics' [Terms of Use](https://www.volgistics.com/terms.htm). 
No warranties are implied or given. Use at your own risk.