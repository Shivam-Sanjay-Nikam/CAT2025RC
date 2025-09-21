# How to Update Essays and Questions

## File Locations
- **Main data file**: `public/data/essays.json`
- **Template file**: `public/data/essays-template.json`
- **Essay content files**: `public/data/essays/` (for external text files)

## Two Ways to Add Essay Content

### Method 1: External Text Files (Recommended for Long Essays)

1. **Create a text file** in `public/data/essays/` (e.g., `essay-001.txt`)
2. **Write your essay** in any format with proper indentation, quotes, etc.
3. **Add essay to JSON** with `contentFile` reference:
   ```json
   {
     "id": "unique-id",
     "title": "Your Essay Title",
     "contentFile": "essays/your-essay-file.txt",
     "wordCount": 50,
     "difficulty": "Easy|Medium|Hard",
     "timeLimit": 10,
     "createdAt": "2024-01-15",
     "questions": [...]
   }
   ```

### Method 2: Inline Content (For Short Essays)

1. **Add essay directly** to JSON with `content` field:
   ```json
   {
     "id": "unique-id",
     "title": "Your Essay Title",
     "content": "Your essay content here...",
     "wordCount": 50,
     "difficulty": "Easy|Medium|Hard",
     "timeLimit": 10,
     "createdAt": "2024-01-15",
     "questions": [...]
   }
   ```

## How to Add Questions

Add questions to the `questions` array in your essay object:

## Important Notes

- **IDs must be unique** across all essays and questions
- **Questions are now nested inside each essay** - much easier to manage!
- **wordCount** should be the actual word count of your essay
- **difficulty** can be: "Easy", "Medium", or "Hard"
- **timeLimit** is in minutes
- **isCorrect** should be `true` for only one option per question
- Use `\n\n` for line breaks in essay content
- **Escape quotes** with backslashes: `"text"` becomes `\"text\"`
- **No unescaped quotes** in the content field

## Daily Workflow

1. Edit `public/data/essays.json`
2. Save the file
3. Refresh your browser - changes will appear immediately!
4. No need to restart the development server

## Example Structure

```json
{
  "essays": [
    {
      "id": "1",
      "title": "Sample Essay",
      "content": "This is a sample essay...",
      "wordCount": 45,
      "difficulty": "Medium",
      "timeLimit": 10,
      "createdAt": "2024-01-15",
      "questions": [
        {
          "id": "q1-1",
          "question": "What is this essay about?",
          "options": [
            { "id": "a1", "text": "Option A", "isCorrect": false },
            { "id": "a2", "text": "Option B", "isCorrect": true }
          ]
        }
      ]
    }
  ]
}
```

## Benefits of New Structure

✅ **Easier to manage** - each essay contains its own questions
✅ **No ID conflicts** - questions are scoped to their essay
✅ **Simpler to add** - just copy one essay block and modify
✅ **Better organization** - everything related to one essay is together
