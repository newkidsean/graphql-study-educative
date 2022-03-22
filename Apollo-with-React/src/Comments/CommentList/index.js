import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withState } from 'recompose';
import ErrorMessage from '../../Error';
import Loading from '../../Loading';

const GET_COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $number: Int!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(number: $number) {
        id
        comments(first: 1, after: $cursor) {
          edges {
            node {
              id
              bodyHTML
              author {
                login
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const COMMENT_STATES = {
  SHOW: 'SHOW',
  HIDE: 'HIDE'
}

const Comments = ({
  repositoryOwner,
  repositoryName,
  number,
  commentState,
  onChangeCommentState
}) => {
  return (
    <div className="Comments">
      <Query
        query={GET_COMMENTS_OF_ISSUE}
        variables={{
          repositoryOwner,
          repositoryName,
          number
        }}
      >
        {({ data, loading, error, fetchMore }) => {
          if (error) {
            return <ErrorMessage error={error} />
          }

          const { repository } = data;
          if (loading && !repository) {
            return <Loading />
          }

          return (
            <CommentList
              comments={repository.issues.comments}
              loading={loading}
              repositoryOwner={repositoryOwner}
              repositoryName={repositoryName}
              fetchMore={fetchMore}
            />
          )
        }}
      </Query>
    </div>
  )
};

const CommentList = ({
  comments,
  loading,
  repositoryOwner,
  repositoryName,
  fetchMore
}) => {
  console.log(comments);
}

export default withState(
  'commentState',
  'onChangeCommentState',
  COMMENT_STATES.SHOW
)(Comments);