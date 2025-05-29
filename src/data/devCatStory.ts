import { Character, StoryEpisode } from '../types/story';

export const mainCharacter: Character = {
  id: 'kamui-cat',
  name: 'Kamui',
  nameJa: 'カムイ',
  description: 'A talented development cat who loves coding and gets hungry frequently. Known for sleeping on keyboards and debugging with cat-like precision.',
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'Git',
    'Code Review',
    'Bug Hunting',
    'Keyboard Walking',
    'Snack Detection'
  ],
  personality: [
    '好奇心旺盛',
    'お腹が空きやすい',
    '集中力抜群（おやつがあるとき）',
    '仲間思い',
    'バグに対して容赦ない'
  ],
  specialMove: 'キーボード上での完璧な昼寝'
};

export const episodes: StoryEpisode[] = [
  {
    id: 'episode-001',
    title: 'The Hungry Morning Coding Session',
    titleJa: 'お腹空いた朝のコーディング',
    content: `It was 9 AM on a Monday morning. Kamui, the development cat, stretched his fluffy paws and hopped onto the desk where his favorite keyboard waited. His human had already left for the office, but Kamui preferred working from home.

"Time to check the pull requests," Kamui meowed softly, his green eyes scanning the GitHub notifications on the screen.

But as he started reviewing the code, his stomach rumbled loudly. "Nyaa... I'm hungry already," he thought. The kibble bowl was half empty, which in cat standards meant it was completely empty and required immediate attention.

Kamui tried to focus on the TypeScript code in front of him. The component looked fine, but something was off...

\`\`\`typescript
const [isHungry, setIsHungry] = useState(true);
\`\`\`

"This developer understands me," Kamui purred approvingly. But then he noticed a problem:

\`\`\`typescript
useEffect(() => {
  if (isHungry) {
    eatFood();
  }
}, []);
\`\`\`

"Nyaa! Missing dependency!" Kamui's tail twitched in annoyance. "This will cause bugs!" He quickly typed with his tiny paws:

\`\`\`typescript
useEffect(() => {
  if (isHungry) {
    eatFood();
  }
}, [isHungry]);
\`\`\`

Satisfied with his code review, Kamui submitted the feedback: "Missing dependency in useEffect. Also, as a fellow hungry developer, I approve of this state management approach. 🐱"

His stomach rumbled again. Time for a snack break before the next review...`,
    contentJa: `月曜日の朝9時。開発猫のカムイは、ふわふわの肉球を伸ばして、お気に入りのキーボードが待つデスクに飛び乗った。人間はもうオフィスに行ってしまったが、カムイは在宅勤務の方が好きだった。

「プルリクエストをチェックする時間だにゃ」とカムイは小さくにゃあと鳴きながら、画面のGitHub通知を緑の瞳でスキャンした。

しかし、コードレビューを始めた途端、お腹が大きく鳴った。「にゃあ...もうお腹空いちゃった」と思う。キブルのお皿は半分空っぽで、猫の基準では完全に空っぽで緊急の補充が必要な状態だった。

カムイは目の前のTypeScriptコードに集中しようとした。コンポーネントは問題なさそうだが、何かがおかしい...

\`\`\`typescript
const [isHungry, setIsHungry] = useState(true);
\`\`\`

「この開発者は分かってるにゃ」とカムイは満足げにゴロゴロ鳴った。しかし、その時問題を発見した：

\`\`\`typescript
useEffect(() => {
  if (isHungry) {
    eatFood();
  }
}, []);
\`\`\`

「にゃあ！依存関係が抜けてるにゃ！」カムイの尻尾がイライラして揺れた。「これはバグの元だにゃ！」小さな肉球で素早くタイプした：

\`\`\`typescript
useEffect(() => {
  if (isHungry) {
    eatFood();
  }
}, [isHungry]);
\`\`\`

コードレビューに満足したカムイは、フィードバックを送信した：「useEffectの依存関係が不足しています。また、同じくお腹を空かせた開発者として、この状態管理アプローチを承認します。🐱」

またお腹が鳴った。次のレビューの前におやつタイムだにゃ...`,
    characterId: 'kamui-cat',
    tags: ['morning', 'code-review', 'react', 'hungry', 'typescript'],
    technicalElements: ['React hooks', 'useEffect', 'useState', 'dependency arrays', 'code review'],
    publishedAt: '2025-05-29T12:00:00Z',
    episodeNumber: 1
  }
];

export const storyMetadata = {
  title: 'The Chronicles of Kamui: A Hungry Dev Cat',
  titleJa: 'お腹空いた開発猫カムイの物語',
  description: 'Follow the daily adventures of Kamui, a talented development cat who balances coding excellence with an endless appetite.',
  descriptionJa: 'コーディングの才能と無限の食欲のバランスを取る、才能ある開発猫カムイの日常の冒険を追いかけよう。',
  genre: ['comedy', 'slice-of-life', 'tech', 'programming'],
  targetAudience: ['programmers', 'developers', 'cat-lovers', 'tech-enthusiasts']
};