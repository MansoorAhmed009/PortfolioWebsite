import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string"
    }),
    defineField({
      name: "heroIntro",
      title: "Hero Intro",
      type: "text",
      rows: 2
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string"
    }),
    defineField({
      name: "socialGithub",
      title: "GitHub URL",
      type: "url"
    }),
    defineField({
      name: "socialLinkedIn",
      title: "LinkedIn URL",
      type: "url"
    })
  ]
});
