import { DevCat, DevCatEpisode, DevScenario } from '../types/devCat';
import { Recipe } from '../types';

// Sample data for development - in a real app, this would come from Supabase
const devCats: DevCat[] = [
  {
    id: 'neko-chan',
    name: 'ネコちゃん',
    role: 'main',
    skills: ['TypeScript', 'React', 'Node.js', 'Git', '料理'],
    favoriteFood: ['寿司', 'ラーメン', 'お魚', 'カツサンド'],
    personality: '好奇心旺盛で食べることが大好きな開発猫。新しい技術への興味が強く、常にお腹を空かせている。',
    specialAbility: 'キーボードの上で完璧に丸くなって寝ること',
    experience: 'senior',
  },
  {
    id: 'debug-kun',
    name: 'デバッグくん',
    role: 'developer',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'テスト'],
    favoriteFood: ['コーヒー', 'エナジードリンク', '夜食', 'ポテチ'],
    personality: 'バグハンターとして有名。深夜のデバッグセッションでは絶対的な集中力を発揮する。',
    specialAbility: '1行のコードでバグの場所を特定すること',
    experience: 'lead',
  },
  {
    id: 'ui-nyan',
    name: 'UIにゃん',
    role: 'developer',
    skills: ['CSS', 'Figma', 'Vue.js', 'Sass', 'デザイン'],
    favoriteFood: ['スイーツ', 'マカロン', '抹茶ラテ', 'フルーツ'],
    personality: '美しいUIにこだわりを持つデザイナー猫。色彩感覚に優れ、ユーザー体験を重視する。',
    specialAbility: 'ピクセルパーフェクトなデザインを一瞬で見抜くこと',
    experience: 'senior',
  },
  {
    id: 'api-sensei',
    name: 'API先生',
    role: 'mentor',
    skills: ['REST API', 'GraphQL', 'Microservices', 'AWS', 'アーキテクチャ'],
    favoriteFood: ['お茶', '和菓子', '蕎麦', '高級魚'],
    personality: 'チームの技術的指導者。複雑なシステム設計を分かりやすく説明する能力に長けている。',
    specialAbility: 'どんなAPIも一瞬で理解し、最適化案を提示すること',
    experience: 'architect',
  },
  {
    id: 'bug-villain',
    name: 'バグ悪役',
    role: 'bug',
    skills: ['混乱', '妨害', 'メモリリーク', 'レースコンディション'],
    favoriteFood: ['エラーログ', 'スタックトレース', '壊れたコード'],
    personality: '開発猫たちの宿敵。常に新しいバグを仕込んで開発者を困らせようとしている。',
    specialAbility: '最も予想外なタイミングでシステムを破綻させること',
    experience: 'senior',
  },
];

const sampleScenarios: DevScenario[] = [
  {
    id: 'scenario-1',
    title: '朝のコードレビュー',
    situation: 'ネコちゃんが朝一番でプルリクエストを確認していると、お腹がぐーっと鳴った。',
    challenge: 'お腹が空いている状態で集中してコードレビューを行わなければならない。',
    solution: 'まず簡単な朝食レシピを実装して、エネルギーを補給してからレビューに取り組む。',
    codeExample: `const quickBreakfast = {
  name: "猫のための簡単おにぎり",
  ingredients: ["ご飯", "のり", "鮭フレーク"],
  cookingTime: 5,
  steps: [
    "ご飯を手のひらサイズに丸める",
    "鮭フレークを中に入れる", 
    "のりで包む"
  ]
};`,
    lesson: 'エネルギー不足は集中力を下げる。適切な休憩と栄養補給が高品質なコードレビューの秘訣。',
    funnyMoment: 'コードの中の変数名を全部食べ物の名前に見間違えてしまった。',
  },
  {
    id: 'scenario-2',
    title: 'ランチタイムデバッグ',
    situation: 'お昼の時間だが、本番環境で緊急のバグが発生。デバッグくんが対応することに。',
    challenge: 'お腹が空いているが、緊急対応を優先しなければならない。',
    solution: 'ペアプログラミングでUIにゃんに手伝ってもらい、効率的にバグを特定する。',
    codeExample: `// バグの原因を発見
const processOrder = (order) => {
  if (!order || !order.items) {
    throw new Error("Order items are required");
  }
  // 修正: null チェックを追加
  return order.items.filter(item => item !== null);
};`,
    lesson: 'チームワークがあれば、困難な状況も乗り越えられる。一人で抱え込まず、助けを求めることも大切。',
    funnyMoment: 'バグを「美味しそうなエラー」と呼んでしまい、チーム全員が笑った。',
  },
];

const sampleEpisodes: DevCatEpisode[] = [
  {
    id: 'episode-1',
    title: '新人開発猫の初日',
    description: 'ネコちゃんが開発チームに加わった初日。新しい環境に慣れながら、最初のタスクに挑戦する。',
    characters: ['neko-chan', 'api-sensei'],
    scenarios: [sampleScenarios[0]],
    hungerLevel: 3,
    techStack: ['TypeScript', 'React', 'Git'],
    relatedRecipes: [],
    episodeType: 'daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'episode-2', 
    title: '緊急バグ対応大作戦',
    description: '本番環境でクリティカルなバグが発生！開発猫チーム総出でバグハントに挑む。',
    characters: ['debug-kun', 'ui-nyan', 'neko-chan'],
    scenarios: [sampleScenarios[1]],
    hungerLevel: 4,
    techStack: ['JavaScript', 'Node.js', 'MongoDB'],
    relatedRecipes: [],
    episodeType: 'debugging',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'episode-3',
    title: 'リモートワークの料理配信システム',
    description: 'リモートワーク中の開発猫たちが、お互いに料理を共有できるシステムを開発する。',
    characters: ['neko-chan', 'ui-nyan', 'api-sensei'],
    scenarios: [
      {
        id: 'scenario-3',
        title: 'レシピAPI設計',
        situation: 'チームで料理共有アプリを作ることになった。まずはAPIの設計から始める。',
        challenge: 'レシピデータを効率的に管理し、検索機能も実装したい。',
        solution: 'RESTful APIを設計し、タグベースの検索システムを実装する。',
        codeExample: `// レシピAPI エンドポイント設計
GET /api/recipes?tags=簡単,時短&difficulty=easy
POST /api/recipes
PUT /api/recipes/:id
DELETE /api/recipes/:id

// レシピデータ構造
interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  cookingTime: number;
}`,
        lesson: 'APIファーストの開発手法により、フロントエンドとバックエンドの並行開発が可能になる。',
        funnyMoment: 'API設計中にお腹が鳴って、料理のことばかり考えてしまった。',
      },
    ],
    hungerLevel: 5,
    techStack: ['TypeScript', 'Express.js', 'PostgreSQL', 'React'],
    relatedRecipes: ['recipe-1', 'recipe-2'],
    episodeType: 'teamwork',
    createdAt: new Date().toISOString(),
  },
];

// Sample developer cat recipes
const devCatRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    postId: 'post-dev-cat-1',
    title: '開発猫のエナジー補給おにぎり',
    description: 'デバッグ中にサクッと食べられる、栄養満点のおにぎりです。コードレビューのお供に最適！',
    ingredients: [
      { name: 'ご飯', amount: '1', unit: '合分' },
      { name: '鮭フレーク', amount: '大さじ2', unit: '' },
      { name: '海苔', amount: '2', unit: '枚' },
      { name: 'ごま塩', amount: '少々', unit: '' },
    ],
    steps: [
      '手を濡らして、ご飯を手のひらサイズに丸める',
      '中央に鮭フレークを入れる',
      '再度ご飯で包んで三角形に整える',
      'ごま塩を軽くふりかける',
      '海苔で包んで完成！',
    ],
    cookingTime: 5,
    servings: 1,
    mealType: 'base',
    storageType: 'refrigerator',
    storageDays: 1,
    difficulty: 'easy',
    tags: ['時短', '簡単', '栄養', 'デバッグ飯', '開発猫'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'recipe-2',
    postId: 'post-dev-cat-2',
    title: 'チームビルディング猫鍋',
    description: 'チーム開発で疲れた時に、みんなで囲む温かい鍋料理。コミュニケーションも深まります。',
    ingredients: [
      { name: '豚バラ肉', amount: '200', unit: 'g' },
      { name: '白菜', amount: '1/4', unit: '個' },
      { name: '豆腐', amount: '1', unit: '丁' },
      { name: 'しいたけ', amount: '4', unit: '個' },
      { name: 'ねぎ', amount: '1', unit: '本' },
      { name: '鍋つゆの素', amount: '1', unit: 'パック' },
      { name: '水', amount: '400', unit: 'ml' },
    ],
    steps: [
      '野菜を食べやすい大きさに切る',
      '鍋に水と鍋つゆの素を入れて沸騰させる',
      '豚肉を入れて火を通す',
      '硬い野菜から順番に入れる',
      '豆腐を最後に加えて温める',
      'チームメンバーと一緒に楽しく食べる！',
    ],
    cookingTime: 20,
    servings: 4,
    mealType: 'main',
    storageType: 'refrigerator',
    storageDays: 2,
    difficulty: 'easy',
    tags: ['チーム', '鍋', '温かい', 'コミュニケーション', '開発猫'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'recipe-3',
    postId: 'post-dev-cat-3',
    title: 'デッドライン前夜のパワフル丼',
    description: 'デッドライン前の最後の追い込みに必要なスタミナをつける、ガッツリ系丼ぶり。',
    ingredients: [
      { name: 'ご飯', amount: '1', unit: '合分' },
      { name: '豚ロース肉', amount: '150', unit: 'g' },
      { name: '玉ねぎ', amount: '1/2', unit: '個' },
      { name: '卵', amount: '2', unit: '個' },
      { name: 'しょうゆ', amount: '大さじ2', unit: '' },
      { name: 'みりん', amount: '大さじ1', unit: '' },
      { name: '砂糖', amount: '小さじ1', unit: '' },
      { name: '青ねぎ', amount: '適量', unit: '' },
    ],
    steps: [
      '豚肉を一口大に切り、玉ねぎは薄切りにする',
      'フライパンで豚肉を炒める',
      '玉ねぎを加えてしんなりするまで炒める',
      '調味料を加えて味を整える',
      '溶き卵を回し入れて半熟状に仕上げる',
      'ご飯の上にのせて青ねぎを散らして完成',
    ],
    cookingTime: 15,
    servings: 1,
    mealType: 'main',
    storageType: 'refrigerator',
    storageDays: 1,
    difficulty: 'medium',
    tags: ['ガッツリ', 'スタミナ', 'デッドライン', '集中力', '開発猫'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getDevCats = async (): Promise<DevCat[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return devCats;
};

export const getDevCatEpisodes = async (): Promise<DevCatEpisode[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return sampleEpisodes;
};

export const getDevCatById = async (id: string): Promise<DevCat | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return devCats.find(cat => cat.id === id) || null;
};

export const getEpisodeById = async (id: string): Promise<DevCatEpisode | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return sampleEpisodes.find(episode => episode.id === id) || null;
};

export const getDevCatRecipes = async (): Promise<Recipe[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return devCatRecipes;
};

export const getDevCatRecipeById = async (id: string): Promise<Recipe | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return devCatRecipes.find(recipe => recipe.id === id) || null;
};