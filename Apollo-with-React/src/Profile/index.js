import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Query } from 'react-apollo';

import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import Loading from '../Loading';
import ErrorMessage from '../Error';

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor: String) {
    viewer {
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
  ${REPOSITORY_FRAGMENT}
`;

const Profile = () => (
  <Query
    query={GET_REPOSITORIES_OF_CURRENT_USER}
    // pagenation 을 할 때 다음 페이지 버튼을 누르면 데이터를 받아오는 동안
    // indicator 역할을 해줄 apollo 내장 함수
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />
      }

      const { viewer } = data;

      if (loading && !viewer) {
        return <Loading />;
      }

      return <RepositoryList
        loading={loading}
        repositories={viewer.repositories}
        fetchMore={fetchMore}
        entry={'viewer'}
      />;
    }}
  </Query>
);

export default Profile;

// Query component 를 HOC 로 추출
// const Profile = ({ data, loading, error, fetchMore }) => {

//   if (error) {
//     return <ErrorMessage error={error} />
//   }

//   const { viewer } = data;

//   if (loading || !viewer) {
//     return <Loading />;
//   }

//   return <RepositoryList
//     repositories={viewer.repositories}
//     fetchMore={fetchMore}
//   />;

// };

// export default graphql(GET_REPOSITORIES_OF_CURRENT_USER)(Profile);