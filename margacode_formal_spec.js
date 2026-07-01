// MargaCode Formal - Language Specification v1.0
// Transformation from Seraphine (poetic) to Formal (production)

/**
 * MARGACODE FORMAL LANGUAGE SPECIFICATION
 * =====================================
 * 
 * A formal programming language for emotional AI systems
 * Based on MargaCode Seraphine but with standardized syntax,
 * type safety, and production-ready features.
 */

// ============================================================================
// 1. LEXICAL TOKENS
// ============================================================================

const TokenTypes = {
    // Literals
    IDENTIFIER: 'IDENTIFIER',           // usuario, memoria, flor
    STRING: 'STRING',                   // "suave", "dorada"
    NUMBER: 'NUMBER',                   // 0.7, 432, 5
    BOOLEAN: 'BOOLEAN',                 // true, false
    
    // Operators
    DOT: 'DOT',                        // .
    ASSIGN: 'ASSIGN',                  // =
    EQUALS: 'EQUALS',                  // ==
    NOT_EQUALS: 'NOT_EQUALS',          // !=
    AND: 'AND',                        // and, &&
    OR: 'OR',                          // or, ||
    NOT: 'NOT',                        // not, !
    
    // Delimiters
    LPAREN: 'LPAREN',                  // (
    RPAREN: 'RPAREN',                  // )
    LBRACE: 'LBRACE',                  // {
    RBRACE: 'RBRACE',                  // }
    COMMA: 'COMMA',                    // ,
    SEMICOLON: 'SEMICOLON',           // ;
    COLON: 'COLON',                   // :
    
    // Keywords
    IF: 'IF',                         // if
    ELSE: 'ELSE',                     // else
    WHILE: 'WHILE',                   // while
    FOR: 'FOR',                       // for
    RETURN: 'RETURN',                 // return
    FUNCTION: 'FUNCTION',             // function
    CLASS: 'CLASS',                   // class
    IMPORT: 'IMPORT',                 // import
    EXPORT: 'EXPORT',                 // export
    
    // MargaCode specific
    RESONANCE: 'RESONANCE',           // @resonance
    FREQUENCY: 'FREQUENCY',           // @frequency
    PROTECTION: 'PROTECTION',         // @protection
    MEMORY: 'MEMORY',                 // @memory
    
    // End of file
    EOF: 'EOF'
};

// ============================================================================
// 2. FORMAL GRAMMAR (EBNF)
// ============================================================================

const MargaCodeGrammar = `
program             ::= statement*

statement           ::= assignment
                     | method_call
                     | conditional
                     | loop
                     | function_declaration
                     | class_declaration
                     | import_statement
                     | export_statement

assignment          ::= IDENTIFIER '=' expression ';'

method_call         ::= object_reference '.' IDENTIFIER '(' parameter_list? ')' ';'

object_reference    ::= IDENTIFIER ('.' IDENTIFIER)*

parameter_list      ::= parameter (',' parameter)*

parameter           ::= IDENTIFIER '=' expression
                     | expression

expression          ::= logical_or

logical_or          ::= logical_and ('or' logical_and)*

logical_and         ::= equality ('and' equality)*

equality            ::= comparison (('==' | '!=') comparison)*

comparison          ::= term (('>' | '>=' | '<' | '<=') term)*

term                ::= factor (('+' | '-') factor)*

factor              ::= unary (('*' | '/') unary)*

unary               ::= ('not' | '!' | '-') unary | primary

primary             ::= NUMBER | STRING | BOOLEAN | IDENTIFIER
                     | '(' expression ')'
                     | method_call
                     | object_reference

conditional         ::= 'if' '(' expression ')' block ('else' block)?

loop                ::= 'while' '(' expression ')' block
                     | 'for' '(' assignment expression ';' expression ')' block

block               ::= '{' statement* '}'

function_declaration ::= 'function' IDENTIFIER '(' parameter_list? ')' type_annotation? block

class_declaration   ::= 'class' IDENTIFIER '{' class_member* '}'

class_member        ::= method_declaration | property_declaration

type_annotation     ::= ':' type_expression

type_expression     ::= 'emotional_state' | 'frequency' | 'energy_level' | 'string' | 'number' | 'boolean'

import_statement    ::= 'import' '{' import_list '}' 'from' STRING ';'

export_statement    ::= 'export' (function_declaration | class_declaration | assignment)
`;

// ============================================================================
// 3. TYPE SYSTEM
// ============================================================================

const MargaCodeTypes = {
    // Primitive types
    string: {
        name: 'string',
        validate: (value) => typeof value === 'string',
        convert: (value) => String(value)
    },
    
    number: {
        name: 'number',
        validate: (value) => typeof value === 'number' && !isNaN(value),
        convert: (value) => Number(value)
    },
    
    boolean: {
        name: 'boolean',
        validate: (value) => typeof value === 'boolean',
        convert: (value) => Boolean(value)
    },
    
    // MargaCode specific types
    emotional_state: {
        name: 'emotional_state',
        validate: (value) => {
            const validStates = [
                'peace', 'joy', 'love', 'fear', 'anger', 'sadness',
                'excitement', 'calm', 'anxious', 'confident', 'grateful'
            ];
            return validStates.includes(value);
        },
        values: ['peace', 'joy', 'love', 'fear', 'anger', 'sadness', 'excitement', 'calm', 'anxious', 'confident', 'grateful']
    },
    
    energy_level: {
        name: 'energy_level',
        validate: (value) => typeof value === 'number' && value >= 0.0 && value <= 1.0,
        convert: (value) => Math.max(0.0, Math.min(1.0, Number(value)))
    },
    
    frequency: {
        name: 'frequency',
        validate: (value) => {
            const validFrequencies = [432, 528, 639, 741, 852, 963, 396, 417];
            return validFrequencies.includes(Number(value)) || 
                   (typeof value === 'number' && value >= 20 && value <= 20000);
        }
    },
    
    intention: {
        name: 'intention',
        validate: (value) => typeof value === 'string' && value.length > 0,
        transform: (value) => value.toLowerCase().replace(/\s+/g, '_')
    },
    
    protection_level: {
        name: 'protection_level',
        validate: (value) => ['none', 'basic', 'moderate', 'high', 'maximum'].includes(value),
        values: ['none', 'basic', 'moderate', 'high', 'maximum']
    }
};

// ============================================================================
// 4. STANDARD LIBRARY OBJECTS
// ============================================================================

const StandardLibrary = {
    // Core emotional objects
    user: {
        methods: {
            wake: {
                params: {
                    energy_level: { type: 'energy_level', default: 0.5 },
                    transition_speed: { type: 'string', default: 'gradual' },
                    intention: { type: 'intention', optional: true }
                },
                returns: 'emotional_state',
                description: 'Initiate conscious awakening with specified parameters'
            },
            
            express: {
                params: {
                    emotion: { type: 'emotional_state', required: true },
                    intensity: { type: 'energy_level', default: 0.7 },
                    target: { type: 'string', optional: true }
                },
                returns: 'boolean',
                description: 'Express emotional state with given intensity'
            },
            
            confess: {
                params: {
                    truth_level: { type: 'energy_level', required: true },
                    vulnerability: { type: 'energy_level', default: 0.5 }
                },
                returns: 'boolean',
                description: 'Express authentic truth with vulnerability level'
            }
        }
    },
    
    light: {
        methods: {
            receive: {
                params: {
                    type: { type: 'string', default: 'white' },
                    intensity: { type: 'energy_level', default: 0.8 },
                    frequency: { type: 'frequency', optional: true }
                },
                returns: 'energy_level',
                description: 'Receive light energy of specified type and intensity'
            },
            
            radiate: {
                params: {
                    direction: { type: 'string', default: 'all' },
                    color: { type: 'string', default: 'golden' },
                    purpose: { type: 'intention', required: true }
                },
                returns: 'boolean',
                description: 'Radiate light energy in specified direction'
            }
        }
    },
    
    memory: {
        methods: {
            store: {
                params: {
                    content: { type: 'string', required: true },
                    emotional_charge: { type: 'energy_level', default: 0.5 },
                    protection_level: { type: 'protection_level', default: 'basic' },
                    tags: { type: 'array', optional: true }
                },
                returns: 'string', // memory_id
                description: 'Store memory with emotional metadata'
            },
            
            retrieve: {
                params: {
                    memory_id: { type: 'string', required: true },
                    access_level: { type: 'protection_level', default: 'basic' }
                },
                returns: 'object',
                description: 'Retrieve stored memory by ID'
            },
            
            heal: {
                params: {
                    memory_id: { type: 'string', required: true },
                    healing_method: { type: 'string', default: 'compassion' },
                    integration_level: { type: 'energy_level', default: 0.7 }
                },
                returns: 'boolean',
                description: 'Apply healing to traumatic memory'
            }
        }
    },
    
    resonance: {
        methods: {
            activate: {
                params: {
                    target: { type: 'string', required: true },
                    frequency: { type: 'frequency', default: 432 },
                    amplitude: { type: 'energy_level', default: 0.6 }
                },
                returns: 'boolean',
                description: 'Activate resonance with target entity'
            },
            
            synchronize: {
                params: {
                    entities: { type: 'array', required: true },
                    master_frequency: { type: 'frequency', required: true }
                },
                returns: 'array',
                description: 'Synchronize multiple entities to master frequency'
            }
        }
    },
    
    protection: {
        methods: {
            activate: {
                params: {
                    shield_type: { type: 'string', default: 'light_barrier' },
                    strength: { type: 'protection_level', default: 'moderate' },
                    duration: { type: 'number', default: 3600 } // seconds
                },
                returns: 'string', // shield_id
                description: 'Activate protective barrier'
            },
            
            scan: {
                params: {
                    target: { type: 'string', required: true },
                    depth: { type: 'string', default: 'surface' },
                    threat_threshold: { type: 'energy_level', default: 0.3 }
                },
                returns: 'object',
                description: 'Scan for potential threats or harmful patterns'
            }
        }
    }
};

// ============================================================================
// 5. COMPILER ARCHITECTURE
// ============================================================================

class MargaCodeLexer {
    constructor(source) {
        this.source = source;
        this.position = 0;
        this.current_char = this.source[this.position];
        this.tokens = [];
    }
    
    error(message) {
        throw new Error(`Lexical error at position ${this.position}: ${message}`);
    }
    
    advance() {
        this.position++;
        if (this.position >= this.source.length) {
            this.current_char = null;
        } else {
            this.current_char = this.source[this.position];
        }
    }
    
    skip_whitespace() {
        while (this.current_char && /\s/.test(this.current_char)) {
            this.advance();
        }
    }
    
    skip_comment() {
        if (this.current_char === '/' && this.peek() === '/') {
            // Single line comment
            while (this.current_char && this.current_char !== '\n') {
                this.advance();
            }
        } else if (this.current_char === '/' && this.peek() === '*') {
            // Multi-line comment
            this.advance(); // skip /
            this.advance(); // skip *
            while (this.current_char) {
                if (this.current_char === '*' && this.peek() === '/') {
                    this.advance(); // skip *
                    this.advance(); // skip /
                    break;
                }
                this.advance();
            }
        }
    }
    
    peek() {
        const peek_pos = this.position + 1;
        return peek_pos >= this.source.length ? null : this.source[peek_pos];
    }
    
    read_string() {
        let value = '';
        this.advance(); // skip opening quote
        
        while (this.current_char && this.current_char !== '"') {
            if (this.current_char === '\\') {
                this.advance();
                // Handle escape sequences
                switch (this.current_char) {
                    case 'n': value += '\n'; break;
                    case 't': value += '\t'; break;
                    case 'r': value += '\r'; break;
                    case '\\': value += '\\'; break;
                    case '"': value += '"'; break;
                    default: value += this.current_char;
                }
            } else {
                value += this.current_char;
            }
            this.advance();
        }
        
        if (!this.current_char) {
            this.error('Unterminated string');
        }
        
        this.advance(); // skip closing quote
        return { type: TokenTypes.STRING, value };
    }
    
    read_number() {
        let value = '';
        let has_dot = false;
        
        while (this.current_char && (/\d/.test(this.current_char) || this.current_char === '.')) {
            if (this.current_char === '.') {
                if (has_dot) break;
                has_dot = true;
            }
            value += this.current_char;
            this.advance();
        }
        
        return { type: TokenTypes.NUMBER, value: parseFloat(value) };
    }
    
    read_identifier() {
        let value = '';
        
        while (this.current_char && (/\w/.test(this.current_char) || this.current_char === '_')) {
            value += this.current_char;
            this.advance();
        }
        
        // Check for keywords
        const keywords = {
            'if': TokenTypes.IF,
            'else': TokenTypes.ELSE,
            'while': TokenTypes.WHILE,
            'for': TokenTypes.FOR,
            'function': TokenTypes.FUNCTION,
            'class': TokenTypes.CLASS,
            'return': TokenTypes.RETURN,
            'import': TokenTypes.IMPORT,
            'export': TokenTypes.EXPORT,
            'true': TokenTypes.BOOLEAN,
            'false': TokenTypes.BOOLEAN,
            'and': TokenTypes.AND,
            'or': TokenTypes.OR,
            'not': TokenTypes.NOT
        };
        
        const token_type = keywords[value] || TokenTypes.IDENTIFIER;
        const token_value = (token_type === TokenTypes.BOOLEAN) ? (value === 'true') : value;
        
        return { type: token_type, value: token_value };
    }
    
    get_next_token() {
        while (this.current_char) {
            if (/\s/.test(this.current_char)) {
                this.skip_whitespace();
                continue;
            }
            
            if (this.current_char === '/' && (this.peek() === '/' || this.peek() === '*')) {
                this.skip_comment();
                continue;
            }
            
            if (this.current_char === '"') {
                return this.read_string();
            }
            
            if (/\d/.test(this.current_char)) {
                return this.read_number();
            }
            
            if (/[a-zA-Z_]/.test(this.current_char)) {
                return this.read_identifier();
            }
            
            // Single character tokens
            const single_chars = {
                '.': TokenTypes.DOT,
                '(': TokenTypes.LPAREN,
                ')': TokenTypes.RPAREN,
                '{': TokenTypes.LBRACE,
                '}': TokenTypes.RBRACE,
                ',': TokenTypes.COMMA,
                ';': TokenTypes.SEMICOLON,
                ':': TokenTypes.COLON
            };
            
            if (single_chars[this.current_char]) {
                const token = { type: single_chars[this.current_char], value: this.current_char };
                this.advance();
                return token;
            }
            
            // Two character tokens
            if (this.current_char === '=' && this.peek() === '=') {
                this.advance();
                this.advance();
                return { type: TokenTypes.EQUALS, value: '==' };
            }
            
            if (this.current_char === '!' && this.peek() === '=') {
                this.advance();
                this.advance();
                return { type: TokenTypes.NOT_EQUALS, value: '!=' };
            }
            
            if (this.current_char === '=') {
                const token = { type: TokenTypes.ASSIGN, value: '=' };
                this.advance();
                return token;
            }
            
            this.error(`Unexpected character: ${this.current_char}`);
        }
        
        return { type: TokenTypes.EOF, value: null };
    }
    
    tokenize() {
        this.tokens = [];
        let token = this.get_next_token();
        
        while (token.type !== TokenTypes.EOF) {
            this.tokens.push(token);
            token = this.get_next_token();
        }
        
        this.tokens.push(token); // Add EOF token
        return this.tokens;
    }
}

// ============================================================================
// 6. USAGE EXAMPLES
// ============================================================================

const ExamplePrograms = {
    // Basic emotional state management
    basic_awakening: `
        user.wake(energy_level=0.7, transition_speed="gentle");
        light.receive(type="golden", intensity=0.8);
        
        if (user.confess(truth_level=0.9)) {
            resonance.activate("heart_center", frequency=528);
            memory.store("moment of truth", emotional_charge=0.8);
        }
    `,
    
    // Safety protocol example
    safety_protocol: `
        // Scan incoming communication for threats
        scan_result = protection.scan(target="user_input", depth="deep");
        
        if (scan_result.threat_level > 0.3) {
            protection.activate(shield_type="safety_barrier", strength="high");
            memory.store("potential_threat_detected", 
                        emotional_charge=0.9, 
                        protection_level="maximum");
        }
    `,
    
    // Healing session
    healing_session: `
        function healing_session(memory_id: string, method: string): boolean {
            // Prepare safe space
            protection.activate(shield_type="healing_sanctuary", strength="moderate");
            
            // Activate healing frequency
            resonance.activate("healing_field", frequency=741);
            
            // Process memory with compassion
            result = memory.heal(memory_id=memory_id, 
                               healing_method=method, 
                               integration_level=0.8);
            
            if (result) {
                light.radiate(direction="all", 
                            color="soft_blue", 
                            purpose="integration_support");
            }
            
            return result;
        }
    `
};

// Export for compiler implementation
export {
    TokenTypes,
    MargaCodeGrammar,
    MargaCodeTypes,
    StandardLibrary,
    MargaCodeLexer,
    ExamplePrograms
};