<script lang="scala">
    import scala.scalajs.js.annotation._
    import lib.fibonacci
    import lib.svelte.onMount

    @JSExportTopLevel("a")
    var a: Int = 0

    @JSExportTopLevel("inc")
    def inc(): Unit = {
      a += 1
    }

    @JSExportTopLevel("fib")
    def fib(n: Int) = fibonacci(n).mkString(" - ")

    @main def main() =
      println("Main!")
      onMount(() => println("Mounted!"))
</script>

<h1>{a}</h1>
<button on:click={_ => inc()}>Increment</button>
<div>Fibonacci numbers: {fib(a)}</div>
