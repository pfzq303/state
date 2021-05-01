declare namespace StateJS {
    export function setRandom(generator : Function);
    export function getRandom() : Function;

    export class Behavior {

        constructor(behavior : Behavior ) ;

        actions : Array;
        
        push(behavior :Function) : this;

        hasActions() : boolean;


        invoke(message, instance, history) : void;
    }

    export enum PseudoStateKind {
        Initial,
        ShallowHistory,
        DeepHistory,
        Choice,
        Junction,
        Terminate
    }


    export enum TransitionKind {
        Internal,
        Local,
        External
    }

    export class Element {
        qualifiedName : string;
        name :string;

        constructor(name : string, parent : Element);
        toString() : string;

        static namespaceSeparator: string;
    }

    export class Region extends Element {
        vertices : Array;
        state : State;

        constructor(name : string, state : Element);
        getRoot() : StateMachine;
        accept(visitor : Visitor, arg1  ?: any, arg2  ?: any, arg3  ?: any) : boolean;

        static defaultName : string;
    }

    export class Vertex extends Element {
        outgoing : Array;
        region : Region;

        constructor(name : String, parent : State);
        getRoot() : StateMachine;
        to(target : State , kind : TransitionKind) : Transition;

        accept(visitor : Visitor, arg1  ?: any, arg2  ?: any, arg3  ?: any) : boolean;
    }

    export class PseudoState extends Vertex {
        constructor(name : string, parent : Element, kind : PseudoStateKind);
        kind : PseudoStateKind;
        isHistory() : boolean;
        isInitial() : boolean;
    }

    export class State extends Vertex {
        exitBehavior : Behavior;
        entryBehavior : Behavior;
        regions : Array;

        defaultRegion() :Region;
        isFinal(): boolean;
        isSimple() :boolean;
        isComposite() : boolean;
        isOrthogonal : boolean;
        entry(exitAction : Function) : this;
        exit(exitAction : Function) : this;
    }

    export class FinalState extends State {
        
    }

    export class StateMachine extends State {
        constructor(name :string);
        clean:boolean;
    }

    export class Transition {
        kind : TransitionKind;
        transitionBehavior : Behavior;
        onTraverse : Behavior;
        source : State;
        target : State;
        guard : Function;

        constructor(source: State, target: State, kind : TransitionKind) ;

        when(guard : Function) : this;
        else() : this;
        effect(transitionAction : Function) : this;

        static TrueGuard : Function;
        static FalseGuard : Function;
    }

    export class Visitor {
        constructor();
        visitElement(element : Element, arg1 ?: any, arg2  ?: any , arg3  ?: any) ;
        visitRegion(region :Region, arg1 ?: any, arg2  ?: any , arg3  ?: any) ;
        visitVertex(vetex :Vertex, arg1 ?: any, arg2  ?: any , arg3  ?: any) ;
        visitPseudoState(state :PseudoState, arg1 ?: any, arg2  ?: any , arg3  ?: any) ;
        visitState(state :State, arg1 ?: any, arg2  ?: any , arg3  ?: any) ;
        visitFinalState(state :FinalState, arg1 ?: any, arg2  ?: any , arg3  ?: any) ;
        visitStateMachine(state :StateMachine, arg1 ?: any, arg2  ?: any , arg3  ?: any) ;
        visitTransition(transition :Transition, arg1 ?: any, arg2  ?: any , arg3  ?: any) ;
    }

    export class StateMachineInstance {
        isTerminated : boolean;
        name : string;
        last : { [key: string]: State; } 

        constructor(name : string);
        setCurrent(region : Region, state : State);
        getCurrent(region : Region) : state;

        toString() : string;

    }

    function isActive(element : Element, stateMachineInstance : StateMachineInstance) : boolean;
    function isComplete(element: Element, instance : StateMachineInstance) : boolean;

    function initialise(stateMachineModel : StateMachine, stateMachineInstance : StateMachineInstance, autoInitialiseModel ?: boolean);

    function evaluate(stateMachineModel: StateMachine, stateMachineInstance: StateMachineInstance, message : any, autoInitialiseModel ?: boolean);

    function evaluateState(state : State, stateMachineInstance: StateMachineInstance, message: any);

    function traverse(transition : Transition, instance: StateMachineInstance, message: any);

    function selectTransition(pseudoState : PseudoState, stateMachineInstance: StateMachineInstance, message: any);
    function findElse(pseudoState : PseudoState);
    function leave(elementBehavior : Function);
    function beginEnter(elementBehavior : Function);
    function endEnter(elementBehavior : Function);
    function ancestors(vertex : Vertex);


    class InitialiseElements extends Visitor {

    }

    export module console{
        export let log : (message : string) => void;
        export let warn : (message : string) => void;
        export let error : (message : string) => void;
    }

    export function validate ( stateMachineModel : StateMachineInstance);

    export class Validator extends Visitor {

    }
}
