import './Skeleton.css';

interface SkeletonProps {
  type?: 'card' | 'text' | 'title' | 'image' | 'details';
  count?: number;
}

const Skeleton = ({ type = 'text', count = 1 }: SkeletonProps) => {
  const skeletons = Array(count).fill(0);

  if (type === 'card') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div key={i} className="skeleton-card glass-panel">
            <div className="skeleton-img shimmer"></div>
            <div className="skeleton-info">
              <div className="skeleton-text shimmer w-1/3 mb-2"></div>
              <div className="skeleton-text shimmer mb-4"></div>
              <div className="skeleton-footer">
                <div className="skeleton-text shimmer w-1/4"></div>
                <div className="skeleton-circle shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'details') {
    return (
      <div className="skeleton-details">
        <div className="skeleton-main-img shimmer"></div>
        <div className="skeleton-content">
          <div className="skeleton-text shimmer w-1/4 mb-2"></div>
          <div className="skeleton-title shimmer mb-4"></div>
          <div className="skeleton-text shimmer w-1/2 mb-8"></div>
          <div className="skeleton-text shimmer mb-2"></div>
          <div className="skeleton-text shimmer mb-2"></div>
          <div className="skeleton-text shimmer w-3/4 mb-8"></div>
          <div className="skeleton-btn shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {skeletons.map((_, i) => (
        <div key={i} className={`skeleton-${type} shimmer`}></div>
      ))}
    </>
  );
};

export default Skeleton;
