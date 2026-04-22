import * as prismic from "@prismicio/client";
import {
  enableAutoPreviews,
  type CreateClientConfig,
} from "@prismicio/svelte/kit";
import config from "../../slicemachine.config.json";

export const repositoryName =
  import.meta.env.VITE_PRISMIC_ENVIRONMENT || config.repositoryName;

const routes: prismic.ClientConfig["routes"] = [
  {
    type: "page",
    uid: "home",
    path: "/",
  },
  {
    type: "page",
    path: "/:uid",
  },
];

export const createClient = ({
  cookies,
  ...config
}: CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    ...config,
  });

  enableAutoPreviews({ client, cookies });

  return client;
};
