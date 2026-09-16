from enum import Enum


class ActivityClass(str, Enum):
    BUILD = "build"
    LEARN = "learn"
    SHIP = "ship"
    COLLABORATE = "collaborate"
    CONTRIBUTE = "contribute"


class ActivityType(str, Enum):
    FEATURE = "feature"
    BUG_FIX = "bug_fix"
    REFACTOR = "refactor"
    RESEARCH = "research"
    DESIGN = "design"
    DOCUMENTATION = "documentation"
    DEPLOYMENT = "deployment"
    LEARNING = "learning"
    OTHER = "other"


class EntrySource(str, Enum):
    MANUAL = "manual"
    GITHUB = "github"
    AI = "ai"
    IMPORT = "import"



class EventSource(str, Enum):
    GITHUB = "github"
    GITLAB = "gitlab"
    MANUAL = "manual"
    DEVTO = "devto"
    HASHNODE = "hashnode"
    LEETCODE = "leetcode"
    IMPORT = "import"
    SYSTEM = "system"