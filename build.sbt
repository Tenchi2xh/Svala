import org.scalajs.linker.interface.ModuleSplitStyle

lazy val svala = project.in(file("."))
  .enablePlugins(ScalaJSPlugin) // Enable the Scala.js plugin in this project
  .settings(
    scalaVersion := "3.3.3",

    Compile / scalaSource := baseDirectory.value / "src",
    Compile / unmanagedSourceDirectories += baseDirectory.value / "tmp",

    scalaJSUseMainModuleInitializer := true,

    scalaJSLinkerConfig ~= {
      _.withModuleKind(ModuleKind.ESModule)
    },

    libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "2.8.0",
  )
