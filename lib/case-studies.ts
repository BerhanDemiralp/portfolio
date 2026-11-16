export type CaseStudy = {
  title: string;
  introduction: string;
  focus?: string;
  steps: { title: string; text: string }[];
  decisions: { title: string; text: string }[];
  engineeringTitle?: string;
  engineeringIntro?: string;
  resultTitle?: string;
  resultIntro?: string;
  outcome: string;
  lessons: { title: string; text: string }[];
  sources: { label: string; path: string }[];
};

// Editorial content is kept separate from the visual components for manual editing.
export const caseStudies: Record<string, CaseStudy> = {
  iuchat: {
    "title": "A clear answer, with somewhere to check it.",
    "introduction": "At İstanbul University-Cerrahpaşa, finding an answer about course details, regulations or Erasmus can mean searching several PDFs without knowing which one contains the rule. We built IUCHAT to make that process easier. Students can ask in Turkish, get a plain-language answer and see which university document and page to check. As a team capstone project, it gave us a practical problem to work through: making information easier to reach while keeping the answer connected to its source.",
    "focus": "From a student question to a traceable answer",
    "steps": [
      {
        "title": "Ask naturally",
        "text": "Write a question in Turkish or start with a suggested question about university life."
      },
      {
        "title": "Find the relevant rule",
        "text": "The system searches official documents for passages that match the question's meaning and terms."
      },
      {
        "title": "Read and verify",
        "text": "Receive a plain-language answer with file and page references, then continue with a follow-up if needed."
      }
    ],
    "decisions": [
      {
        "title": "Reading inconsistent PDFs",
        "text": "Some documents had selectable text, while others included scanned pages. We used PyMuPDF first and EasyOCR when the text layer was missing. We cleaned line breaks and kept page numbers so results could lead back to the original documents."
      },
      {
        "title": "Keeping passages meaningful",
        "text": "LlamaIndex SentenceSplitter let us split around sentence boundaries. We used a chunk size of 512 with 128 overlap so rules split across passages would retain nearby context. We encoded those passages and user questions with multilingual BGE-M3 and stored the passage vectors and their metadata together in Supabase PostgreSQL with pgvector."
      },
      {
        "title": "Adding a second way to search",
        "text": "Meaning-based search handled questions phrased differently from the source, but could miss exact names and university abbreviations. We added Turkish full-text search and expanded terms such as ÖBİS where appropriate. Reciprocal Rank Fusion combines the two lists by rank because their scores are on different scales."
      },
      {
        "title": "Turning evidence into a conversation",
        "text": "We used Gemini to draft Turkish answers from the retrieved passages and Streamlit to prototype the chat, suggested questions and streamed responses in Python. File and page labels let students check the evidence. Short conversation history supports follow-up questions, and when no passages are found the app tells the user."
      }
    ],
    "engineeringTitle": "What sits behind the conversation",
    "engineeringIntro": "We used retrieval-augmented generation (RAG) so each question first goes through a search of official documents. The matching passages then become the evidence the model uses to write its answer.",
    "resultTitle": "Evaluate the search and the answer separately",
    "resultIntro": "We evaluated the prototype on 200 university-related questions. The test scenarios included suggested questions, follow-ups, questions outside the university scope and source display. Retrieval metrics tell us whether the evidence was found; answer accuracy tells us whether it became a useful response.",
    "outcome": "The result is a Turkish-language assistant that combines document retrieval, a conversational interface and visible sources. The evaluation also exposed incomplete or unsupported answers, so citations remain part of the experience: students can inspect the underlying rule rather than rely on the generated response alone. These results describe the project's evaluation, not a guarantee for every future question.",
    "lessons": [
      {
        "title": "A weak answer can start long before generation",
        "text": "Building IUCHAT taught me to trace an answer back through extraction, chunking and retrieval. Before changing a prompt, I need to check whether the model received the right evidence at all."
      },
      {
        "title": "Search methods solve different problems",
        "text": "Semantic search connects different ways of asking the same question. Keyword search protects exact names and abbreviations. Combining them made retrieval a deliberate design decision rather than a single database call."
      },
      {
        "title": "Metadata is part of the user experience",
        "text": "File names and page numbers are not just database fields. Preserving them through the pipeline lets the interface explain where an answer came from and gives the student a way to verify it."
      },
      {
        "title": "Evaluate the system in parts",
        "text": "Retrieval quality and answer quality need separate checks. That distinction helps identify what to improve and keeps a plausible-sounding response from being mistaken for a correct one."
      }
    ],
    "sources": []
  },
  "social-media-app": {
    title: "Making room for a conversation.",
    introduction: "MOMENT explores a simple idea: give people a reason to start talking, rather than another feed to scroll. Friends and group members can meet through scheduled pairings, then continue their conversations through a shared messaging experience. The project brings a Flutter mobile client together with a backend that owns identity, relationships and conversation rules.",
    focus: "From a temporary meeting to lasting conversation history",
    steps: [
      { title: "Find your people", text: "User search, friend requests and groups establish who can connect." },
      { title: "Meet in a Moment", text: "Scheduled friend and group pairings create a time-limited opportunity to talk." },
      { title: "Keep the conversation", text: "Conversation history survives the Moment; group friendship consent is handled separately." },
    ],
    decisions: [
      { title: "Flutter for the client; NestJS for the rules", text: "The Flutter code separates presentation, repositories and API clients. NestJS modules keep authentication, groups, friendships, matching and messages in distinct backend services. This gives the same relationship rules a single home across screens." },
      { title: "A Moment is not a conversation", text: "Prisma stores temporary pairing state separately from conversations and their participants. A daily event can expire without deleting its message history. The matching service also applies a seven-day friend rematch cooldown instead of repeatedly pairing the same people." },
      { title: "Persist first, then notify", text: "The Socket.io gateway delegates message creation to the conversation service. Stored-message events notify the conversation room and refresh inboxes. Supabase-backed authentication and participant checks protect both history access and real-time room entry." },
      { title: "Use spec-driven development with OpenSpec", text: "We used OpenSpec to document proposals, design choices and acceptance scenarios for feature changes. Moving from match-scoped messaging to reusable conversations is one example: the specs captured the intended behavior as groups, matching and notifications evolved." },
    ],
    outcome: "The repository contains a mobile client, REST APIs, real-time messaging, relationship management and a scheduled matching lifecycle. It is a product implementation, with backend and Flutter tests for specific behaviors; no public adoption or latency figures are claimed here.",
    lessons: [
      { title: "Model time separately from identity", text: "Temporary events and persistent conversations have different lifetimes. Treating them separately makes expiration and history much easier to reason about." },
      { title: "UI state is not authorization", text: "A disabled send button is only presentation. Membership and write permissions also need to be checked by the server." },
      { title: "Think beyond the happy path", text: "Reconnects, repeated scheduler runs and inbox updates make consistency as important as the first successful message." },
    ],
    sources: [
      { label: "Conversation and participant model", path: "blob/main/backend/prisma/schema.prisma" },
      { label: "Real-time gateway", path: "blob/main/backend/src/events/events.gateway.ts" },
      { label: "Matching implementation", path: "blob/main/backend/src/matching-engine/matching-engine.service.ts" },
      { label: "Design decisions and alternatives", path: "blob/main/openspec/changes/archive/2026-05-09-matching-system/design.md" },
    ],
  },
  "coupon-recommendation": {
    title: "Would this offer be worth the detour?",
    introduction: "A coupon is only useful when it fits the situation. This project explores whether someone would accept an offer while travelling, using context such as destination, passengers, weather, distance and coupon type. The aim was to work through the full classification process: understand the data, establish a baseline, compare models and decide how a probability becomes a recommendation.",
    focus: "An experiment in decisions, not just predictions",
    steps: [
      { title: "Understand the context", text: "12,684 UCI records describe driving scenarios and coupon acceptance." },
      { title: "Compare fairly", text: "A stratified 80/20 split and five-fold training cross-validation support model comparison." },
      { title: "Choose the operating point", text: "Out-of-fold probabilities select an F1-oriented threshold before final test reporting." },
    ],
    decisions: [
      { title: "Fix the representation before tuning the model", text: "The car field is more than 99% missing, so it is removed. The redundant direction_opp field is dropped, distance indicators are combined and occupations are grouped. These choices make the inputs more usable before any model search." },
      { title: "Keep learned preprocessing inside the pipeline", text: "Numerical fields use median imputation and scaling; categorical fields use mode imputation and one-hot encoding. scikit-learn pipelines fit these transformations within each training fold, and handle previously unseen categories." },
      { title: "A simple baseline earns its place", text: "A majority-class classifier is compared with Logistic Regression, calibrated LinearSVC and Random Forest. Five-fold ROC-AUC favors Random Forest. Randomized search then narrows the search space before a smaller grid search." },
      { title: "The best threshold is a trade-off", text: "The selected threshold is 0.4342, using training out-of-fold predictions. On the recorded test split, acceptance recall reaches 0.8988 while precision is 0.7265. Finding more likely acceptances also means recommending some offers that will be rejected." },
    ],
    outcome: "The saved final test output reports F1 0.8035, ROC-AUC 0.8288 and average precision 0.8482 on 2,537 examples. These are recorded notebook results, not a deployed conversion rate. Earlier cells also inspect the test split, so a fresh untouched holdout would strengthen a future evaluation.",
    lessons: [
      { title: "A strong-looking metric needs context", text: "Even the majority baseline obtains a relatively high F1 because acceptance is the more frequent class. ROC-AUC and class-specific errors tell a more complete story." },
      { title: "Thresholds change the product behavior", text: "Choosing a model and choosing how often to recommend are separate decisions. Precision and recall make that distinction visible." },
      { title: "Evaluation discipline is part of the model", text: "Cross-validation, preprocessing boundaries and a genuinely untouched final test are engineering decisions, not reporting details." },
    ],
    sources: [{ label: "Notebook: preprocessing, comparison and saved results", path: "blob/main/coupon_recommendation.ipynb" }],
  },
  "image-segmentation": {
    title: "Reading an image, one pixel at a time.",
    introduction: "I worked on turning satellite images into maps of buildings, roads, land, vegetation and water. The goal was to label regions at pixel level rather than describe an entire image with one category. What began as a U-Net implementation became a practical lesson in preparing data, debugging training and judging whether an experiment actually improved the predictions.",
    focus: "The image and its mask must stay in step",
    steps: [
      { title: "Crop & tile", text: "Large images and masks are cropped to compatible dimensions and split into 256 × 256 patches." },
      { title: "Translate the labels", text: "Six RGB mask colors become class IDs and one-hot targets." },
      { title: "Train, inspect & compare", text: "U-Net predictions are checked against reference masks, followed by class-level evaluation and test-time augmentation experiments." },
    ],
    decisions: [
      { title: "Choose tools I could learn with the team", text: "PyTorch was already used by the team, so it became the framework for my training and implementation. I chose U-Net after studying comparable segmentation work and its available learning resources. Its encoder–decoder and skip connections gave me a concrete way to understand how spatial detail is recovered." },
      { title: "Make images and labels agree", text: "Different image sizes led to 256 × 256 patching with OpenCV, PIL and patchify. Hex mask colors became RGB values, class IDs and one-hot targets. Early shape mismatches and incorrect image–mask handling pushed me to revisit Dataset and DataLoader with the team. Correcting the Dataset setup resolved the data-loading problem and allowed me to move on to improving the predictions." },
      { title: "Keep the experiment comparable between runs", text: "Repeatedly creating data splits made comparisons difficult. After considering a fixed random seed and cross-validation, I chose to save Train, Valid and Test splits into separate folders. Images were stored with OpenCV and mask arrays with NumPy, then loaded through the revised data pipeline." },
      { title: "Look beyond overall accuracy", text: "I plotted precision, recall, F1 and IoU by class using Seaborn. Investigating the missing unlabeled predictions led me to count pixels per class and identify its low representation. I also removed image–mask pairs with undefined labels, tried blur augmentation and experimented with a lower learning rate." },
      { title: "Align augmented predictions before combining them", text: "For test-time augmentation I tried Gaussian blur and horizontal/vertical flips, reversing the geometric transforms on predictions before combining them. Channel-by-channel RGB voting could create colors outside the class palette, so I wrote a pixel-wise vote over the known classes instead." },
    ],
    outcome: "The project brought together corrected data loading, six-class segmentation predictions, class-level analysis, fixed data splits and a working test-time augmentation pipeline. After correcting the evaluation conversions, one experiment achieved approximately 85% accuracy without TTA and 84% with TTA. The additional transformations did not improve that comparison, showing why each technique needs to be evaluated rather than assumed to help. These figures describe that experiment, not a final benchmark; evaluation code received further fixes afterward.",
    lessons: [
      { title: "Debug the data before changing the model", text: "Printing paired images and masks, checking tensor shapes and understanding Dataset behavior proved more useful than changing model parameters without a clear diagnosis." },
      { title: "A comparison needs stable inputs", text: "Saving the data splits made repeated experiments easier to interpret. The class distribution also explained failures that an overall accuracy number could hide." },
      { title: "An extra technique is not automatically an improvement", text: "TTA taught me to reverse transformations correctly, vote over classes rather than color channels, and keep prediction representations consistent during evaluation—even when the final comparison did not improve." },
    ],
    sources: [{ label: "U-Net, label conversion and prediction notebook", path: "blob/main/SProject.ipynb" }],
  },
  "e-carbon": {
    title: "A footprint with a traceable history.",
    introduction: "A monthly emissions total is more useful when it can be traced back to the activities and factors that produced it. e-Carbon organizes company and facility activity records, turns them into monthly emissions snapshots, and produces reports whose stored files can be checked for changes. The focus is the accounting trail around a number, not just the calculation itself.",
    focus: "From a changing activity record to a frozen reporting period",
    steps: [
      { title: "Record", text: "Company → facility → activity, with quantity, unit, date and scope." },
      { title: "Snapshot", text: "Copy quantities and factor values into a monthly record and calculate Scope 1 / Scope 2 totals." },
      { title: "Freeze & report", text: "Freeze the snapshot, generate a PDF and store its SHA-256 hash." },
    ],
    decisions: [
      { title: "Use feature slices for business operations", text: ".NET 9 endpoints are grouped around actions such as CreateSnapshot and GenerateReport. MediatR handlers hold the operations, FluentValidation handles input rules, and EF Core with PostgreSQL persists the relationships." },
      { title: "Keep the factor used at the time", text: "Snapshot items copy the activity quantity and the emission factor instead of keeping only a reference to a mutable factor. Later factor updates therefore do not silently rewrite the stored monthly calculation." },
      { title: "Separate draft data from a reportable record", text: "A snapshot has an explicit Draft/Frozen state. PDF generation checks for the frozen state, making the report lifecycle part of backend behavior instead of relying on a user remembering the correct sequence." },
      { title: "Verify the artifact, not only its database row", text: "QuestPDF generates the document. The verification handler reads the saved file, recomputes its SHA-256 hash and compares it with the stored value. That detects file changes; it does not certify the underlying emissions data." },
    ],
    outcome: "The implementation covers activities, factor-based calculation, monthly snapshots, PDF generation and file-integrity checks. It is a reporting backend rather than a demonstrated AI forecasting system. One current edge case is that snapshot creation skips activities without a matching active factor; explicit missing-factor reporting would make completeness easier to audit.",
    lessons: [
      { title: "Historical values need their own model", text: "A report should preserve the inputs used to calculate it, even when the operational database changes later." },
      { title: "Model the lifecycle explicitly", text: "Draft, freeze and report are different operations with different permissions and invariants." },
      { title: "Traceability has several layers", text: "Input validation, saved factor values, audit records and file hashes answer different questions about trust." },
    ],
    sources: [
      { label: "Snapshot calculation and copied factors", path: "blob/main/src/eCarbon.Api/Features/Snapshots/CreateSnapshot/CreateSnapshotHandler.cs" },
      { label: "PDF generation", path: "blob/main/src/eCarbon.Api/Features/Reports/GenerateReport/GenerateReportHandler.cs" },
      { label: "File-integrity verification", path: "blob/main/src/eCarbon.Api/Features/Reports/VerifyReport/VerifyReportHandler.cs" },
    ],
  },
  "keep-in-touch": {
    title: "Keeping the next visit in context.",
    introduction: "KeepInTouch is a Flutter prototype for following animal care records. It connects an animal profile with its owner and visit forms, so someone reviewing a record can see what has been filled in and what still needs attention. The project explores how a small mobile interface can make a record-heavy workflow easier to follow.",
    focus: "One animal, a history of care",
    steps: [
      { title: "Find the record", text: "Browse and filter the animal list, with a visible summary of form review status." },
      { title: "Open the profile", text: "See the animal, its owner and associated forms together." },
      { title: "Review the visit", text: "Open routine checks, vaccinations, surgeries or emergency forms." },
    ],
    decisions: [
      { title: "Let the domain shape the screens", text: "Animal, Owner, FormEntry and FormType models separate identity from visit records. Keeping forms attached to an animal makes repeat visits a history rather than a collection of unrelated pages." },
      { title: "Show the work still waiting", text: "The home screen derives status from isFilled and isChecked. It distinguishes no forms, unchecked forms and reviewed records, turning internal data into a useful scanning cue." },
      { title: "Prototype behind a service boundary", text: "AnimalService returns mock animals and updates forms in memory. Screens consume asynchronous methods through FutureBuilder, leaving a clear place for a future API without claiming that persistence already exists." },
    ],
    outcome: "The repository provides a mobile workflow prototype with local sample records, profiles and visit-form screens. Authentication is simulated and form changes are in memory. A persistent backend and real identity management remain outside the demonstrated implementation.",
    lessons: [
      { title: "Status is part of usability", text: "A concise review state can make a long list useful before a user opens an individual record." },
      { title: "Define the boundary before replacing the data", text: "A service interface helps separate exploring a workflow from integrating a backend." },
      { title: "Make scope legible to a team", text: "Separating a prototype from a production integration keeps the next development steps concrete." },
    ],
    sources: [
      { label: "Team roles", path: "blob/main/README.md" },
      { label: "Animal service and prototype scope", path: "blob/main/lib/services/animal_service.dart" },
      { label: "List and review states", path: "blob/main/lib/screens/home_page.dart" },
      { label: "Visit categories", path: "blob/main/lib/models/form_type.dart" },
    ],
  },
  "vertical-slice-architecture": {
    title: "Change one feature without losing the whole picture.",
    introduction: "This project explores how to organize an API around the actions it performs. Products, categories and feature flags live in focused slices rather than being scattered across broad technical layers. A runtime flag system gives the architecture a practical use case: controlling which version of a feature is available without another deployment.",
    focus: "A request follows the feature that owns it",
    steps: [
      { title: "Resolve the flag", text: "Look up the flag for the requested user type, falling back to the default configuration." },
      { title: "Check the state", text: "An endpoint filter checks whether the flag is enabled and matches the required version." },
      { title: "Run the slice", text: "The endpoint hands its command to a handler, persists the change and invalidates affected caches." },
    ],
    decisions: [
      { title: "Keep related code close", text: "Minimal API slices include their command, handler and endpoint mapping. CreateProductV2 is a compact example: validation, persistence and the flag requirement can be understood together." },
      { title: "Use Redis as a cache, SQLite as persistence", text: "FeatureFlagService checks its cache before looking up the user-type flag and then the default flag in EF Core. The database remains the persistent record while Redis supports repeated lookups." },
      { title: "Cache invalidation is part of writing", text: "Product cache services distinguish individual product keys from the list key. CreateProductV2 invalidates the cached product list after saving, so the read path can rebuild it with the new entry." },
      { title: "Make the local environment repeatable", text: "Docker Compose provides development and production profiles, Redis and a persisted SQLite volume. This makes infrastructure part of the example instead of an undocumented manual setup." },
    ],
    outcome: "The result is an architecture example with product/category operations, version-gated endpoints, caching and container configuration. It demonstrates runtime feature control without claiming a measured performance gain. The flag filter reads a User-Type header, so segmentation should not be treated as a trusted authorization boundary on its own.",
    lessons: [
      { title: "Architecture becomes clearer through a real use case", text: "Feature flags make dependencies, endpoint policies and caching visible in a small enough system to inspect." },
      { title: "A read optimization changes the write path", text: "Adding a cache also creates responsibility for key design, expiry and invalidation." },
      { title: "Feature access and security are different concerns", text: "A flag selects behavior; trusted identity and permissions still need their own checks." },
    ],
    sources: [
      { label: "Complete product V2 slice", path: "blob/main/Features/Products/CreateProductV2.cs" },
      { label: "Flag resolution and fallback", path: "blob/main/Services/FeatureFlag/FeatureFlagService.cs" },
      { label: "Endpoint flag filter", path: "blob/main/Features/FeatureFlags/FeatureFlagFilter.cs" },
    ],
  },
  "inventory-system": {
    title: "Small items. A surprising number of rules.",
    introduction: "An inventory looks like a grid, but every slot represents a set of decisions: can this item be bought, stacked, equipped or consumed? This Unity project builds those rules around ScriptableObjects, connecting item definitions, inventory limits, shop stock and a tabbed player interface.",
    focus: "What happens between selecting an item and using it?",
    steps: [
      { title: "Define the item", text: "An Item asset carries an icon, description, type, price, stack limits and effect/cooldown fields." },
      { title: "Check the inventory", text: "CanBuy and AddItem consider stock, existing stacks, empty slots and category limits." },
      { title: "Reflect the change", text: "The inventory UI updates icons, quantities and equipment; tabs separate consumable and throwable items." },
    ],
    decisions: [
      { title: "Use assets to describe items", text: "CreateAssetMenu exposes Item and InventoryScriptable in the Unity editor. Item configuration can be inspected and adjusted as data rather than repeated in UI code." },
      { title: "Keep inventory rules separate from presentation", text: "InventoryScriptable contains stack and category checks, while the Inventory MonoBehaviour manages selection and visible slots. TabManager switches inventory, ability and category panels." },
      { title: "Buying is more than finding an empty slot", text: "The code distinguishes shopStack, player stack and stackSize. It also checks consumable, permanent and throwable category capacities. These checks prevent a simple grid interaction from bypassing inventory rules." },
      { title: "Make consumption visible", text: "Removal updates the stack and can return a slot to the null-item placeholder. The UI also tracks equipped items and delay state, linking data changes to what the player sees." },
    ],
    outcome: "The repository demonstrates inventory and shop interactions, stacking, equipment and tabbed UI in Unity. Runtime values also live on Item assets, which makes shared ScriptableObject state an important consideration for future save systems or multiple inventories.",
    lessons: [
      { title: "A feature is a set of invariants", text: "Stock, capacity and stack limits need to remain consistent through buying, equipping and consuming, not just when drawing the grid." },
      { title: "Data-driven design makes iteration tangible", text: "Editable assets let item properties change without rebuilding every interaction around them." },
      { title: "Separate definitions from session state as a system grows", text: "A shared item definition and a particular player's quantity have different ownership and persistence needs." },
    ],
    sources: [
      { label: "Item asset definition", path: "blob/main/Assets/Scripts/Item.cs" },
      { label: "Capacity and stack rules", path: "blob/main/Assets/Scripts/InventoryScriptable.cs" },
      { label: "Inventory UI integration", path: "blob/main/Assets/Scripts/Inventory.cs" },
    ],
  },
  naor: {
    title: "Building mechanics that belong in a shared world.",
    introduction: "The Nine Aspect of Realms is a 2D pixel-art action platformer developed by the OTK team. Movement, combat, enemy behavior and world interactions come together in a Unity project. My contribution is best understood through the systems a player touches: inventory and equipment, throwable weapons, and the interface that communicates their state.",
    steps: [
      ],
    decisions: [
      { title: "Work inside a larger player system", text: "The team project uses a state-machine-based controller and Unity's Input System for movement and combat. Item mechanics need to cooperate with those existing systems rather than creating a parallel player controller." },
      { title: "Connect mechanics across boundaries", text: "A throwable item crosses inventory, equipment, spawning and effects. My recorded commits include adding bombs and daggers to the inventory as well as implementing their behavior, showing the integration work around a mechanic." },
      { title: "Treat feedback as part of gameplay", text: "Inventory colors, text layout, equipment behavior and mana/soul bars appear throughout my commits. These changes help a player understand what is selected, available or consumed." },
      { title: "Keep team work traceable", text: "The repository uses feature branches, a develop branch and Jira issue keys. My commits reference NAOR-60, NAOR-80 and NAOR-84, linking incremental fixes and features to the team's work items." },
    ],
    outcome: "NAOR brings together the team's movement, combat and world systems. My public commit history specifically documents inventory/equipment changes, bomb and dagger mechanics, and UI fixes. The full game and its artwork are credited to OTK.",
    lessons: [
      { title: "Integration is part of implementation", text: "A mechanic is only useful when its input, inventory cost, visual effect and UI feedback agree." },
      { title: "Small fixes can change how a game feels", text: "Correct equipment state, stack behavior and readable bars are as relevant to playability as adding another ability." },
      { title: "Build for the next teammate", text: "Feature branches and issue-linked commits make work easier to review and combine in a shared Unity project." },
    ],
    sources: [
      { label: "My contribution history", path: "commits/develop/?author=BerhanDemiralp" },
      { label: "Team project and technology", path: "blob/develop/README.md" },
      { label: "Inventory integration", path: "tree/develop/Assets/Scripts/UI/Inventory" },
      { label: "Throwable mechanics", path: "tree/develop/Assets/Scripts/UI/Throwable" },
    ],
  },
};
