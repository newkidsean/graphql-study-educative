import React, { Fragment } from 'react';
import Loading from '../../Loading';
import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem';
import Issues from '../../Issue';
import '../style.css';

// const updateQuery = (previousResult, { fetchMoreResult }) => {
//   if (!fetchMoreResult) {
//     return previousResult;
//   }

//   return {
//     ...previousResult,
//     viewer: {
//       ...previousResult.viewer,
//       repositories: {
//         ...previousResult.viewer.repositories,
//         ...fetchMoreResult.viewer.repositories,
//         edges: [
//           ...previousResult.viewer.repositories.edges,
//           ...fetchMoreResult.viewer.repositories.edges,
//         ]
//       }
//     }
//   }
// };
const getUpdateQuery = entry => (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    [entry]: {
      ...previousResult[entry],
      repositories: {
        ...previousResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...previousResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges,
        ]
      }
    }
  }

};

const RepositoryList = ({ repositories, fetchMore, loading, entry }) => (
  <Fragment>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />

        <Issues
          repositoryName={node.name}
          repositoryOwner={node.owner.login}
        />
      </div>
    ))}

    {/* {loading ? (
      <Loading />
    ) : (
      repositories.pageInfo.hasNextPage && (
        <button
          type="button"
          onClick={() =>
            fetchMore({
              variables: {
                cursor: repositories.pageInfo.endCursor,
              },
              updateQuery
            })
          }
        >
          More Repositories
        </button>
      )
    )} */}
    {/* 위에 있는 로직을 FetchMore 컴포넌트로 분리 */}
    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor,
      }}
      // updateQuery={updateQuery}
      updateQuery={getUpdateQuery(entry)}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>
  </Fragment>
)

export default RepositoryList;