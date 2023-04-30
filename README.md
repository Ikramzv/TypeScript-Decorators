## What is a "Decorator" ?

A Decorator is simply JavaScript function that are run in the compile time , and helps us to extend the behavior of the decorated declaration.
For Example :
@SetId
class Time {} // All Implementations is in index.ts

# Decorator Factory

What if we want to pass an argument to the decorator ? At this time , "Decorator Factory" comes into play . It is just "Higher Order" function.
By re-writing above code , we can change the code like that :

@TimeLine()
@SetId
class Time {} // All Implementations is in index.ts

# What type of Decorators we have ?

- Class Decorators
- Method Decorators
- Property Decorators
- Parameter Decorators
- Accessor Decorators

# Signatures of each type of decorators

type MethodDecorator = (targetPrototype: Object, methodName: string | Symbol, descriptor: PropertyDescriptor) => PropertyDescriptor | void

type ParameterDecorator = (targetPrototype : Object, methodName: string | Symbol, parameterIndex: number) => void

type PropertyDecorator = (targetPrototype : Object, propertyKey: string | Symbol) => void

type ClassDecorator = <T extends Function>(targetConstructor: T) => T | void

# Why doesn't PropertyDecorator function have descriptor parameter ?

Because Decorators are all run in the compile time , and in the compile time , all properties are undefined unlike in the runtime .
