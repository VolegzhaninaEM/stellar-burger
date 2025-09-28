#!/bin/bash

# Скрипт для удаления всех автогенерированных файлов .module.css.d.ts
# Эти файлы больше не нужны, так как мы используем глобальную типизацию

echo "🧹 Удаление автогенерированных файлов .module.css.d.ts..."

# Находим и удаляем все файлы .module.css.d.ts
find src -name "*.module.css.d.ts" -type f -delete

echo "✅ Все файлы .module.css.d.ts удалены"

# Проверяем, что файлы удалены
remaining_files=$(find src -name "*.module.css.d.ts" -type f | wc -l)
echo "📊 Оставшихся файлов .module.css.d.ts: $remaining_files"

if [ "$remaining_files" -eq 0 ]; then
  echo "🎉 Очистка завершена успешно!"
else
  echo "⚠️  Некоторые файлы могут не быть удалены"
  echo "Оставшиеся файлы:"
  find src -name "*.module.css.d.ts" -type f
fi
