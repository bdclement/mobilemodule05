import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
      "eas": {
        "projectId": "3d95c5fc-9066-4798-baef-0e6ee896d773"
      }
  },
});
