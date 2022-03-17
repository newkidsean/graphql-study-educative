import 'cross-fetch/polyfill';
import ApolloClient, { gql } from 'apollo-boost';
import 'dotenv/config';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    })
  }
});

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
query($organization: String!, $cursor: String) {
  organization(login: $organization) {
    name
    url
    repositories(
      first: 5
      orderBy: { direction: DESC, field: STARGAZERS }
      after: $cursor
    ) {
      edges {
        node {
          ...repository
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
fragment repository on Repository {
  name
  url
}
`;

const ADD_STAR = gql`
  mutation AddStar($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR = gql`
  mutation RemoveStar($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

client.query({
  query: GET_REPOSITORIES_OF_ORGANIZATION,
  variables: {
    organization: 'the-road-to-learn-react',
    cursor: undefined,
  }
})
  .then(result => {
    const { pageInfo, edges } = result.data.organization.repositories;
    const { endCursor, hasNextPage } = pageInfo;

    console.log('second page :', edges.length);
    console.log('endCursor :', endCursor);

    return pageInfo;
  })
  .then(({ endCursor, hasNextPage }) => {
    if (!hasNextPage) {
      throw Error('no next page')
    }
    return client.query({
      query: GET_REPOSITORIES_OF_ORGANIZATION,
      variables: {
        organization: 'the-road-to-learn-react',
        cursor: endCursor
      }
    })
  })
  .then(result => {
    const { pageInfo, edges } = result.data.organization.repositories;
    const { endCursor, hasNextPage } = pageInfo;

    console.log('second page :', edges.length);
    console.log('endCursor :', endCursor);

    return pageInfo;
  }).catch(console.log);

client.mutate({
  mutation: ADD_STAR,
  variables: {
    repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
  }
})
  // .then(console.log);
  .then(result => {
    const { starrable } = result.data.addStar;
    console.log('starrable add star:', starrable);
    return starrable;
  }).catch(console.log);

client.mutate({
  mutation: REMOVE_STAR,
  variables: {
    repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
  }
})
  .then(result => {
    const { starrable } = result.data.removeStar;
    console.log('starrable remove star :', starrable);
    return starrable;
  }).catch(console.log);
