# Legal Terms Schema for Contextual Tutor
# This schema stores legal terminology with AI-powered explanations

module default {
  # Legal Term Entity
  type LegalTerm {
    required property term -> str {
      constraint exclusive;
      constraint max_len_value(200);
    }
    
    # Formal legal definition (from KBBI/Law texts)
    required property definition_formal -> str;
    
    # Simple explanation for non-lawyers
    required property definition_simple -> str;
    
    # Analogy for better understanding
    required property analogy -> str;
    
    # Category (e.g., "pidana", "perdata", "tata negara")
    property category -> str;
    
    # Related pasal/articles
    multi property related_articles -> str;
    
    # Examples of usage
    multi property examples -> str;
    
    # Usage tracking
    property usage_count -> int64 {
      default := 0;
    }
    
    # Difficulty level (1-5)
    property difficulty_level -> int16 {
      constraint min_value(1);
      constraint max_value(5);
      default := 3;
    }
    
    # Timestamps
    property created_at -> datetime {
      default := datetime_current();
    }
    property updated_at -> datetime {
      default := datetime_current();
    }
    
    # Link to related terms
    multi link related_terms -> LegalTerm;
    
    # Link to resources
    multi link resources -> LegalResource;
  }
  
  # Legal Resource (Articles, Videos, Cases)
  type LegalResource {
    required property title -> str;
    required property type -> str; # "article", "video", "case_study", "simulation"
    property url -> str;
    property content -> str;
    property reading_time -> int16; # in minutes
    property difficulty_level -> int16;
    
    property created_at -> datetime {
      default := datetime_current();
    }
    
    # Reverse link
    multi link related_terms := .<resources[is LegalTerm];
  }
  
  # User Term Interaction Tracking
  type TermInteraction {
    required link user -> User;
    required link term -> LegalTerm;
    required property action_type -> str; # "hover", "click", "learn_more"
    required property timestamp -> datetime {
      default := datetime_current();
    }
    property context -> str; # The AI response where term appeared
  }
  
  # User entity (simplified for now)
  type User {
    required property email -> str {
      constraint exclusive;
    }
    property subscription_tier -> str {
      default := "free";
    }
    property created_at -> datetime {
      default := datetime_current();
    }
  }
}
