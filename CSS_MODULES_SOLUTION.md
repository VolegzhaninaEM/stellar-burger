# CSS Modules - Решение проблемы с типизацией

## Проблема
Ранее в проекте использовался плагин `typescript-plugin-css-modules`, который автоматически генерировал файлы `.module.css.d.ts` с неправильной структурой экспорта:

```typescript
// ❌ Неправильно (старый формат)
declare const classNames: {
  readonly container: "container"; // строковые литералы
};
export default classNames; // неправильный экспорт
```

Это приводило к ошибкам TypeScript: `File '*.module.css.d.ts' is not a module`

## Решение
Мы заменили автоматическую генерацию типов на глобальную типизацию CSS модулей:

### 1. Глобальный файл типов
Создан файл `src/types/css-modules.d.ts`:
```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export = classes;
}
```

### 2. Обновлена конфигурация TypeScript
- Убран проблемный плагин `typescript-plugin-css-modules`
- Добавлен путь к глобальным типам в `tsconfig.json`

### 3. Автоматизация
Созданы скрипты для предотвращения проблемы:

```bash
# Очистка проблемных файлов
npm run clean:css-types

# Сборка с автоматической очисткой
npm run build
```

## Преимущества нового подхода

✅ **Стабильность**: Нет автогенерации проблемных файлов  
✅ **Простота**: Единая типизация для всех CSS модулей  
✅ **Автоматизация**: Автоматическая очистка при сборке  
✅ **Надежность**: Нет конфликтов с системой модулей TypeScript  

## Использование

CSS модули продолжают работать как обычно:

```typescript
import styles from './component.module.css';

// TypeScript знает, что styles - это объект с string свойствами
<div className={styles.container}>Content</div>
```

## Команды

- `npm run build` - сборка с автоматической очисткой
- `npm run clean:css-types` - ручная очистка CSS типов
- `npm run dev` - разработка (очистка не требуется)

## Важно
- Файлы `*.module.css.d.ts` теперь удаляются автоматически
- Не создавайте эти файлы вручную
- Используйте глобальную типизацию из `src/types/css-modules.d.ts`
