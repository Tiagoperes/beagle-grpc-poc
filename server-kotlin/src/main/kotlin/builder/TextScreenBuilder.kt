package builder

import br.com.zup.beagle.widget.layout.Container
import br.com.zup.beagle.widget.layout.Screen
import br.com.zup.beagle.widget.layout.ScreenBuilder
import br.com.zup.beagle.widget.ui.Text

object TextScreenBuilder : ScreenBuilder {
    override fun build() = Screen(
        child = Container(
            children = listOf(
                Text("Hello. This is a text!")
            )
        )
    )
}

