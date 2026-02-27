import { defineArrayMember, defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(6).max(100)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(30).max(240)
    }),
    defineField({
      name: "problem",
      title: "Problem Statement",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().min(50)
    }),
    defineField({
      name: "impact",
      title: "Impact",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2)
    }),
    defineField({
      name: "demoUrl",
      title: "Demo URL",
      type: "url"
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url"
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required()
        })
      ]
    })
  ]
});
