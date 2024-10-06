using Conventus.Models.Entities.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Conventus.DAL.EfStructures;
using Conventus.Models.Entities;

namespace Conventus.DAL.Initialization
{
    public static class SampleDataInitializer
    {
        internal static void ClearData(ConventusDbContext context)
        {
            var entities = new[]
            {
                typeof(User).FullName,
                typeof(Conference).FullName,
                typeof(Presentation).FullName,
                typeof(Reservation).FullName,
                typeof(Room).FullName
            };

            foreach (var entityName in entities)
            {
                var entity = context.Model.FindEntityType(entityName);
                var tableName = entity.GetTableName();
                var schemaName = entity.GetSchema();
                context.Database.ExecuteSqlRaw($"DELETE FROM {schemaName}.{tableName}");
                context.Database.ExecuteSqlRaw($"DBCC CHECKIDENT (\"{schemaName}.{tableName}\", RESEED, 1);");
            }
        }

        internal static void SeedData(ConventusDbContext context)
        {
            try
            {
                ProcessInsert(context, context.Rooms, SampleData.Rooms);
                ProcessInsert(context, context.Users, SampleData.Users);
                ProcessInsert(context, context.Conferences, SampleData.Conferences);
                ProcessInsert(context, context.Presentations, SampleData.Presentations);
                ProcessInsert(context, context.Reservations, SampleData.Reservations);
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        private static void ProcessInsert<TEntity>(
            ConventusDbContext context, DbSet<TEntity> table, List<TEntity> records) where TEntity : BaseEntity
        {
            if (table.Any())
            {
                return; // Avoid inserting data if the table already has records.
            }

            IExecutionStrategy strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() =>
            {
                using var transaction = context.Database.BeginTransaction();
                try
                {
                    var metaData = context.Model.FindEntityType(typeof(TEntity).FullName);
                    context.Database.ExecuteSqlRaw(
                        $"SET IDENTITY_INSERT {metaData.GetSchema()}.{metaData.GetTableName()} ON");

                    table.AddRange(records);
                    context.SaveChanges();

                    context.Database.ExecuteSqlRaw(
                        $"SET IDENTITY_INSERT {metaData.GetSchema()}.{metaData.GetTableName()} OFF");
                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw; // Rethrow the exception after rollback
                }
            });
        }

        internal static void DropAndCreateDatabase(ConventusDbContext context)
        {
            context.Database.EnsureDeleted();
            context.Database.Migrate();
        }

        public static void InitializeData(ConventusDbContext context)
        {
            DropAndCreateDatabase(context);
            SeedData(context);
        }

        public static void ClearAndReseedDatabase(ConventusDbContext context)
        {
            ClearData(context);
            SeedData(context);
        }
    }
}
