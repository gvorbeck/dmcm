//===================
// GENERATE MDX SLUGS
// (Cannot be dynamically generated from /pages so they live in /content)
//===================
const { createFilePath } = require("gatsby-source-filesystem");
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  // you only want to operate on `Mdx` nodes. If you had content from a
  // remote CMS you could also check to see if the parent node was a
  // `File` node here
  if (node.internal.type === "Mdx") {
    const value = createFilePath({ node, getNode })
    createNodeField({
      // Name of the field you are adding
      name: "slug",
      // Individual MDX node
      node,
      // Generated value based on filepath with "blog" prefix. you
      // don't need a separating "/" before the value because
      // createFilePath returns a path with the leading "/".
      value: `${value}`,
    })
  }
}

//===============
// PAGE TEMPLATES
//===============
const path = require('path');
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      adventures: allMdx(filter: {fields: {slug: {regex: "/adventures\\\\/\\\\w+\\\\/$/i"}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
      locations: allMdx(filter: {fields: {slug: {regex: "/locations/"}}}) {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }
  const adventures = result.data.adventures.edges;
  adventures.forEach(({ node }, index) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/components/adventure-page-layout/adventure-page-layout.js`),
      context: {
        id: node.id,
        locations: `${node.fields.slug}locations/`,
        notes: `${node.fields.slug}notes/`,
        npcs: `${node.fields.slug}npcs/`,
      },
    })
  });

  const locations = result.data.locations.edges;
  locations.forEach(({ node }, index) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/components/location-page-layout/location-page-layout.js`),
      content: {
        id: node.id,
      },
    })
  });
}
