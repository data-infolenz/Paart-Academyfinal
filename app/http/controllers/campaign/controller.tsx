import { createController } from "remix/router"
import { renderStaticCmsSlug } from "~/app/http/controllers/public/cms-responder"
import { routes } from "~/routes"

export default createController(routes.campaign, {
  actions: {
    async show(ctx) {
      const cleanSlug = `/${ctx.params.slug.replace(/^\/+|\/+$/g, "")}`
      return renderStaticCmsSlug(ctx, cleanSlug)
    }
  }
})
