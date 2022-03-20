import React from 'react';
import Loading from '../Loading';
import { ButtonUnobtrusive } from '../Button';
import './style.css';

const FetchMore = ({
  loading,
  hasNextPage,
  variables,
  updateQuery,
  fetchMore,
  children
}) => (
  <div className="FetchMore">
    {loading ? (
      <Loading />
    ) : (
      hasNextPage && (
        <ButtonUnobtrusive
          className="FetchMore-button"
          onClick={() => fetchMore({ variables, updateQuery })}
        >
          More {children}
        </ButtonUnobtrusive>
      )
    )}
    {/* 재사용 할 수 있는 버튼 컴포넌트를 만들어서 아래 코드를 이동 */}
    {/* <button
      type="button"
      className="FetchMore-button"
      onClick={() => fetchMore({ variables, updateQuery })}
    >
      More {children}
    </button> */}
  </div>
)

export default FetchMore;