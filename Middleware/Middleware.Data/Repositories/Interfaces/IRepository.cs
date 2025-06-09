using Middleware.Data.Entities.Infrastructure;
using System.Linq.Expressions;

namespace Middleware.Data.Repositories.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task<T> Insert(T entity, CancellationToken cancellationToken);
        T Update(T entity);
        Task<int> Commit(CancellationToken token);
        Task<T?> GetByFilter(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken);
        Task<T?> Find(Guid id, CancellationToken cancellationToken);
        Task<bool> Any(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken);
    }
}
