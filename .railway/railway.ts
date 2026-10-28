import { defineRailway, github, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "lace-portal";
export default defineRailway(() => {
  const lacePortal = service("lace-portal", {
    source: github("mariafferrazz/lace-portal", { branch: "main", checkSuites: false, rootDirectory: "backend" }),
    build: { buildCommand: "npm run build", buildEnvironment: "V3", builder: "NIXPACKS" },
    start: "npm start",
    healthcheck: "/api/health",
    healthcheckTimeout: 300,
    deploy: {
      restartPolicyType: "ALWAYS",
      restartPolicyMaxRetries: null,
    },
    replicas: { "sfo": 1 },
    domains: ["api.lablace.com.br"],
  });

  return project("feisty-commitment", {
    variables: { managed: false },
    resources: [lacePortal],
  });
});
