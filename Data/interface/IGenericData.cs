// Archivo: Data/IGenericData.cs
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Data
{
    /// <summary>
    /// Interfaz genérica para operaciones de acceso a datos.
    /// </summary>
    /// <typeparam name="TEntity">Tipo de entidad.</typeparam>
    /// <remarks>
    /// Esta interfaz define métodos para crear, obtener, actualizar y eliminar entidades.
    /// </remarks>
    public interface IGenericData<TEntity> where TEntity : class
    {
        Task<TEntity> CreateAsync(TEntity entity);
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<TEntity> GetByIdAsync(object id);
        Task<bool> UpdateAsync(TEntity entity);
        Task<bool> DeleteAsync(object id);
        Task<bool> PermanentDeleteAsync(object id);
    }
}