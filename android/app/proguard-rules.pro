# Capacitor
-keep class com.getcapacitor.** { *; }
-keep class org.apache.cordova.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# WebView with JS interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface public *;
}

# Keep line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# AndroidX
-keep class androidx.** { *; }
-keep interface androidx.** { *; }
