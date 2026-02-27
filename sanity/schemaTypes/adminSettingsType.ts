import { defineArrayMember, defineField, defineType } from "sanity";

export const adminSettingsType = defineType({
  name: "adminSettings",
  title: "Admin Settings",
  type: "document",
  fields: [
    defineField({
      name: "quickLinks",
      title: "Dashboard Quick Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required().min(3).max(80)
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required().min(10).max(220)
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "string",
              validation: (rule) => rule.required().min(1)
            }),
            defineField({
              name: "isExternal",
              title: "External Link",
              type: "boolean",
              initialValue: true
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Content", value: "content" },
                  { title: "Comments", value: "comments" },
                  { title: "Contacts", value: "contacts" },
                  { title: "Analytics", value: "analytics" },
                  { title: "Operations", value: "operations" }
                ]
              },
              initialValue: "operations"
            }),
            defineField({
              name: "order",
              title: "Display Order",
              type: "number",
              initialValue: 10
            }),
            defineField({
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true
            })
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "href"
            }
          }
        })
      ]
    })
  ]
});