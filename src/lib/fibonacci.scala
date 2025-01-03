package lib

import scala.annotation.tailrec

def fibonacci(size: Int): Seq[Long] =

  @tailrec
  def fib(n: Int, a: Long, b: Long, acc: List[Long]): List[Long] =
    if (n <= 0) acc
    else fib(n - 1, b, a + b, acc :+ a)

  fib(size, 0L, 1, Nil)
