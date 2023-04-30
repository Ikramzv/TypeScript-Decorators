import { randomUUID } from "crypto"

function Log() {
    return (target: any, methodName: string, desc: PropertyDescriptor) => {
        const self = target // or target.constructor.prototype

        const origin = desc.value // Refers to value passed through previous decorator.
        // We can access by doing self[name] but it will refer to the original function that is declared in the class

        console.log("Compile Time :",self.date) // COMPILATION TIME ; date is undefined
        desc.value = function () {
            console.log("Runtime :",self.date) // RUNTIME : date is the current date declared by TimeLine decorator.
            return origin.apply(this, arguments)
        }
    }
}

function TimeLine(date?: Date) {
    const factory = function (constructor: any) {
        Object.defineProperty(constructor.prototype, "date" , {
            get () {
                return date ? date : new Date() // Both are same thing, but it is just for showing that up to readers how does it work
            },
            set(v) {
                throw new Error("Readonly property can not be updated")
            }
        })
    }
    return factory
}

function Measure(measurer?: ((comment: string) => void), comment?: string) {
    return function (t: any, n: string , desc: PropertyDescriptor) {
        const original = desc.value // Refers to original
        desc.value = function () {
            const d = new Date().getTime()
            console.log(this)
            const res = original.apply(this, arguments)
            const xtime = new Date().getTime() - d

            const result = `Returned : ${res}`
            const text = `Execution time has been ${xtime}ms; ${result}`
            if(measurer) measurer(typeof comment !== "undefined" ? `${comment}; ${result}` : text)
            else console.log(text)

            return original.apply(this, arguments)
        }
    }
}

function SetId(constructor: any) {
    Object.defineProperty(constructor.prototype, "_id", {
        get() {
            return randomUUID()
        },
        enumerable: false,
        configurable: false,
    })
}

@TimeLine(new Date())
@SetId
class Time {
    readonly type: string
    date: Date

    constructor(type : string) {
        this.type = type
    }

    @Log()
    @Measure(console.warn)
    time() {
        for(let i = -1; i < 1000000000; i++);
        return this.date.getTime()
    }
}

const date = new Time("DATE")

console.log("RETURNED : ", date.time())