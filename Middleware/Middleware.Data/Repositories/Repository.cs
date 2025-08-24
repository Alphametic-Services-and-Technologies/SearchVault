using Microsoft.EntityFrameworkCore;
using Middleware.Data.Entities.Infrastructure;
using Middleware.Data.Repositories.Interfaces;
using System.Linq.Expressions;

namespace Middleware.Data.Repositories
{
    internal class Repository<T>(MiddlewareDbContext dbContext) : IRepository<T> where T : BaseEntity
    {
        private readonly MiddlewareDbContext _dbContext = dbContext;
        private readonly DbSet<T> _entities = dbContext.Set<T>();

        public async Task<T?> GetByID(Guid id, CancellationToken cancellationToken)
        {
            return await _entities.FindAsync(id, cancellationToken);
        }

        public async Task<T?> GetByFilter(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
        {
            return await _entities.SingleOrDefaultAsync(predicate, cancellationToken);
        }

        public async Task<T> Insert(T entity, CancellationToken cancellationToken)
        {
            var t = await _entities.AddAsync(entity, cancellationToken);
            return t.Entity;
        }

        public T Update(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            var t = _entities.Attach(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;
            return t.Entity;
        }

        public void Remove(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            _entities.Remove(entity);
        }

        public async Task<int> Commit(CancellationToken token)
        {
            return await _dbContext.SaveChangesAsync(token);
        }

        public async Task<T?> Find(Guid id, CancellationToken cancellationToken)
        {
            return await _entities.FindAsync([id], cancellationToken);
        }

        public async Task<bool> Any(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
        {
            return await _entities.AnyAsync(predicate, cancellationToken);
        }

        public async Task<IList<T>> GetMany(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
        {
            return await _entities.Where(predicate).ToListAsync(cancellationToken);
        }
    }
}
