import { randomUUID } from "crypto"

function Log() {
    return (target: any, name: string, desc: PropertyDescriptor) => {
        const self = target.constructor.prototype
        const origin = self[name] || desc.value
        console.log(self.date) // COMPILATION TIME ; date is undefined
        desc.value = function (...args : any[]) {
            console.log(self.date) // RUNTIME : date is the current date .
            return origin.apply(this, args)
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
    return function (target: any, name: string , desc: PropertyDescriptor) {
        const original = desc.value // Refers to original
        desc.value = function (...args: any[]) {
            const d = new Date().getTime()
            console.log(this)
            const res = original.apply(this, args)
            const xtime = new Date().getTime() - d

            const result = `Returned : ${res}`
            const text = `Execution time has been ${xtime}ms\n${result}`
            if(measurer) measurer(typeof comment !== "undefined" ? `${comment}${result}` : text)
            else console.log(text)

            return original.apply(this, args)
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
    // @Measure(function(){}, "")
    time() {
        for(let i = -1; i < 100000000; i++);
        return this.date.getTime()
    }
}

const date = new Time("DATE")

console.log("RETURNED : ", date.time())